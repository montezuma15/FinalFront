# Paseo App

App para reservar las zonas comunes de una unidad residencial.

- [`paseoGlobant/`](paseoGlobant): backend Spring Boot + PostgreSQL
- [`paseoappfront/`](paseoappfront): frontend React + Vite ([README](paseoappfront/README.md))

## Levantar todo con Podman

```bash
cp .env.example .env
podman compose up -d --build
```

Abre http://localhost:8081. Los comandos, la configuración y el porqué de cada imagen están en [DOCKER.md](DOCKER.md).
