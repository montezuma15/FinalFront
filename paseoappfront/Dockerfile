# =====================================================================
# Frontend Paseo App (React + Vite) - construccion en dos etapas
#   1. compilacion: Node instala dependencias y genera los archivos estaticos (dist/)
#   2. ejecucion:   Nginx sirve dist/ y reenvia /paseoapi/ al backend
# Los nombres de imagen van completos (docker.io/library/...) para Podman.
# =====================================================================

# ---------- Etapa 1: compilacion ----------
FROM docker.io/library/node:24-alpine AS compilacion
WORKDIR /app

# Primero solo los manifiestos: la capa de "npm ci" queda en cache
# mientras package-lock.json no cambie
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite "hornea" la URL del API en el JavaScript al compilar.
# /paseoapi/v1 es relativa: el navegador llama al mismo Nginx que sirve la app,
# y Nginx la reenvia al backend (asi no hace falta CORS)
ARG VITE_API_URL=/paseoapi/v1
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build


# ---------- Etapa 2: ejecucion ----------
FROM docker.io/library/nginx:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compilacion /app/dist /usr/share/nginx/html

EXPOSE 80
