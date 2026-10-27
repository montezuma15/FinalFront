# =====================================================================
# Backend PaseoAPP (Spring Boot) - construccion en dos etapas
#   1. compilacion: Maven + JDK compilan y empaquetan el .jar
#   2. ejecucion:   solo un JRE liviano corre el .jar (sin Maven ni codigo fuente)
# Los nombres de imagen van completos (docker.io/library/...) porque Podman
# no asume Docker Hub: con nombres cortos pregunta el registro o falla.
# =====================================================================

# ---------- Etapa 1: compilacion ----------
FROM docker.io/library/maven:3.9-eclipse-temurin-21 AS compilacion
WORKDIR /app

# Primero solo el pom: si no cambian las dependencias, esta capa queda en cache
# y los siguientes builds no las vuelven a descargar
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Luego el codigo. Los tests se corren aparte (mvn test); aqui solo se empaqueta
COPY src ./src
RUN mvn -B -q package -DskipTests \
    && cp target/*.jar app.jar


# ---------- Etapa 2: ejecucion ----------
FROM docker.io/library/eclipse-temurin:21-jre-alpine
WORKDIR /app

# Nunca correr la aplicacion como root dentro del contenedor
RUN addgroup -S paseo && adduser -S paseo -G paseo
COPY --from=compilacion --chown=paseo:paseo /app/app.jar app.jar
USER paseo

EXPOSE 8080

# MaxRAMPercentage: la JVM usa hasta el 75% de la memoria que se le de al contenedor
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
