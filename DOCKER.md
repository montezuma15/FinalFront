# Paseo App con Podman

Toda la app corre en 3 contenedores definidos en [`compose.yaml`](compose.yaml):

| Servicio | Imagen | Puerto en tu máquina | Qué hace |
|---|---|---|---|
| `db` | `postgres:17-alpine` | 5432 | Base de datos PostgreSQL (datos en el volumen `datos-postgres`) |
| `backend` | `localhost/paseoapp-backend` (se construye de `paseoGlobant/Dockerfile`) | 8080 | API Spring Boot |
| `frontend` | `localhost/paseoapp-frontend` (se construye de `paseoappfront/Dockerfile`) | 8081 | Nginx: sirve el React y reenvía `/paseoapi/` al backend |

```
navegador ──► :8081 frontend (Nginx) ──/paseoapi/──► backend:8080 ──► db:5432
```

El navegador solo habla con Nginx, así que no hay CORS de por medio. Los puertos 8080 y 5432 se exponen para usar Postman y pgAdmin/DBeaver.

---

## 1. Preparar Podman (una sola vez)

En Windows y macOS, Podman corre los contenedores dentro de una máquina virtual Linux:

```bash
podman machine init
podman machine start
podman --version
```

`podman compose` delega en un "proveedor" de compose. Instala uno de los dos:

```bash
pip install podman-compose        # opción 1 (versión 1.1 o superior)
podman compose version            # verifica que lo encuentra
```

Si usas **Podman Desktop**, ya trae `docker-compose` como proveedor (opción 2).

## 2. Configurar las variables

```bash
cp .env.example .env
```

Edita `.env` y cambia `POSTGRES_PASSWORD` y `PASEO_JWT_SECRETO` (mínimo 32 caracteres). El archivo `.env` está en `.gitignore`. Si no existe, el compose usa valores de desarrollo.

## 3. Construir y levantar todo

Desde la carpeta raíz del repo (donde está `compose.yaml`):

```bash
podman compose build              # construye las imágenes del backend y del frontend
podman compose up -d              # levanta db, backend y frontend en segundo plano
```

O en un solo paso:

```bash
podman compose up -d --build
```

Abre **http://localhost:8081**. La primera vez el backend crea las tablas y carga los 5 espacios de ejemplo. Regístrate para crear tu primer usuario.

## 4. Comandos del día a día

| Para… | Comando |
|---|---|
| Ver el estado de los contenedores | `podman compose ps` |
| Ver los logs del backend en vivo | `podman compose logs -f backend` |
| Reconstruir solo el backend tras cambiar código | `podman compose up -d --build backend` |
| Reconstruir solo el frontend | `podman compose up -d --build frontend` |
| Entrar a PostgreSQL | `podman compose exec db psql -U paseo -d paseo` |
| Ver las tablas | `podman compose exec db psql -U paseo -d paseo -c "\dt"` |
| Detener todo (conserva los datos) | `podman compose down` |
| Detener y **borrar los datos** | `podman compose down -v` |
| Ver las imágenes construidas | `podman images \| grep paseoapp` |
| Borrar imágenes intermedias sin uso | `podman image prune` |

## 5. Construir las imágenes sin compose (opcional)

Útil para entender qué hace el compose por debajo:

```bash
# Imágenes
podman build -t localhost/paseoapp-backend:latest  ./paseoGlobant
podman build -t localhost/paseoapp-frontend:latest ./paseoappfront

# Red y volumen
podman network create paseoapp
podman volume create paseoapp-datos

# Contenedores (el nombre "backend" importa: nginx.conf lo usa)
podman run -d --name db --network paseoapp \
  -e POSTGRES_DB=paseo -e POSTGRES_USER=paseo -e POSTGRES_PASSWORD=paseo \
  -v paseoapp-datos:/var/lib/postgresql/data -p 5432:5432 \
  docker.io/library/postgres:17-alpine

podman run -d --name backend --network paseoapp \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/paseo \
  -e SPRING_DATASOURCE_USERNAME=paseo -e SPRING_DATASOURCE_PASSWORD=paseo \
  -e PASEO_JWT_SECRETO=un-secreto-largo-de-al-menos-32-caracteres \
  -p 8080:8080 localhost/paseoapp-backend:latest

podman run -d --name frontend --network paseoapp -p 8081:80 \
  localhost/paseoapp-frontend:latest
```

## 6. Desarrollo local (sin contenerizar el código)

Solo la base de datos en contenedor; backend y frontend como siempre:

```bash
podman compose up -d db                      # PostgreSQL en localhost:5432 (paseo/paseo)
cd paseoGlobant && ./mvnw spring-boot:run    # usa los valores por defecto de application.properties
cd paseoappfront && npm run dev              # http://localhost:5173
```

Los tests del backend (`./mvnw test`) **no** necesitan PostgreSQL: usan H2 en memoria con el perfil `test`.

---

## Cómo están construidas las imágenes

Ambos Dockerfiles usan **dos etapas**. La primera tiene todas las herramientas para compilar. La segunda solo lo necesario para ejecutar. De la primera solo se copia el resultado (el `.jar` o la carpeta `dist/`).

| Etapa | Backend | Frontend |
|---|---|---|
| Compilación | `maven:3.9-eclipse-temurin-21` | `node:24-alpine` |
| Ejecución | `eclipse-temurin:21-jre-alpine` | `nginx:1.28-alpine` |

- Los nombres de imagen van completos (`docker.io/library/...`). Podman no asume Docker Hub: con nombres cortos pregunta de qué registro descargar, o falla en modo no interactivo.
- Se copia primero `pom.xml` / `package-lock.json` y se descargan las dependencias. Después se copia el código. Así, si solo cambia el código, la capa de dependencias sale de la caché y el build es mucho más rápido.
- El backend corre con un usuario sin privilegios (`paseo`), no como root.
- El frontend se compila con `VITE_API_URL=/paseoapi/v1`, una ruta relativa. Por eso la misma imagen funciona en cualquier dominio o puerto.

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `short-name ... did not resolve to an alias` | Una imagen sin `docker.io/...`. Los archivos del repo ya usan nombres completos; revisa si agregaste alguna |
| El backend se reinicia al primer arranque | PostgreSQL aún no aceptaba conexiones. El compose espera el healthcheck (`service_healthy`) y además tiene `restart: unless-stopped`. Con `podman-compose` < 1.1 la espera no se respeta: actualízalo |
| `port is already allocated` | Otro programa usa ese puerto. Cámbialo en `.env` (`FRONTEND_PUERTO`, `BACKEND_PUERTO`, `POSTGRES_PUERTO`) |
| Desde **Git Bash**, `--build-arg VITE_API_URL=/paseoapi/v1` termina como `C:/Program Files/Git/paseoapi/v1` | Git Bash convierte los argumentos que parecen rutas. Antepón `MSYS_NO_PATHCONV=1` al comando, o no pases el argumento (ese ya es el valor por defecto) |
| Cambié el código y no veo el cambio | Hay que reconstruir: `podman compose up -d --build <servicio>` |
