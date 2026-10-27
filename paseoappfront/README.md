# Paseo App — Frontend

App para reservar las zonas comunes de una unidad residencial (piscina, salón social, gimnasio, BBQ...).
React 19 + Vite + Bootstrap 5 con tema propio (Sass). Consume el API de `paseoGlobant` (Spring Boot).

## Cómo correrlo

1. Levantar el backend (`paseoGlobant`): `./mvnw spring-boot:run` → `http://localhost:8080`
2. En esta carpeta:

```bash
npm install
npm run dev      # http://localhost:5173
```

La URL del API se puede cambiar con `VITE_API_URL` en un archivo `.env`.

## Autenticación y roles

- `POST /auth/login` devuelve un **JWT** y el usuario. El front guarda solo el token (`services/almacenToken.js`).
- Cada petición envía `Authorization: Bearer <token>` (interceptor en `services/clienteApi.js`).
- Al recargar, el rol **siempre** se pide al backend (`GET /auth/yo`); nunca se confía en lo guardado en el navegador.
- Si el backend responde 401 (token vencido o alterado) se cierra la sesión y se vuelve a `/login`.

Piezas principales:

| Archivo | Para qué |
|---|---|
| `contexto/ContextoAuth.jsx` | `ProveedorAuth` + `useAuth()`: usuario, `iniciarSesion`, `registrarse`, `cerrarSesion`, `puede(permiso)`, `tieneRol(...)` |
| `auth/permisos.js` | Única tabla de qué rol puede hacer qué (`PERMISOS`) |
| `auth/navegacion.js` | Opciones del menú y el permiso que necesita cada una |
| `rutas/RutaPrivada.jsx` | Solo usuarios logueados |
| `rutas/RutaPorRol.jsx` | Solo quien tenga el permiso → si no, `/sin-permiso` |
| `rutas/RutaPublica.jsx` | Login/registro; si ya hay sesión redirige |
| `componentes/Autorizado.jsx` | Muestra u oculta botones según el permiso |

> Ocultar botones en el front es solo comodidad: **quien protege los datos es el backend** (`@PreAuthorize`).

## Permisos

| Recurso | ADMINISTRADOR | USUARIO |
|---|---|---|
| Usuarios: listar / cambiar rol / eliminar | ✅ | ❌ |
| Espacios: ver | ✅ | ✅ |
| Espacios: crear / editar / eliminar | ✅ | ❌ |
| Reservas: crear | ✅ | ✅ (a su nombre) |
| Reservas: ver las propias | ✅ | ✅ |
| Reservas: ver las de todos | ✅ | ❌ |
| Reservas: cancelar | cualquiera | solo las propias |

## Rutas

| Ruta | Acceso |
|---|---|
| `/login`, `/registro` | pública |
| `/inicio`, `/espacios`, `/espacios/:id/reservar`, `/mis-reservas` | cualquier usuario logueado |
| `/admin/espacios/nuevo`, `/admin/espacios/:id/editar`, `/admin/reservas`, `/admin/usuarios` | administrador |

## Nota

El registro permite elegir el rol (incluido ADMINISTRADOR) para facilitar las demos de clase.
En un sistema real el registro debería asignar siempre `USUARIO` y solo un administrador cambiar roles.
