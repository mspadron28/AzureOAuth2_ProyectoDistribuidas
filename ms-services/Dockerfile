# ETAPA 1: Compilación
FROM openjdk:17-jdk-slim AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo lo necesario para instalar dependencias
COPY ./pom.xml .
COPY ./.mvn .mvn/
COPY ./mvnw .

#DESCARGAR DEPENDENCIAS
RUN ./mvnw dependency:go-offline
#Copiar el código fuente y compilar
COPY ./src ./src
RUN ./mvnw clean package -DskipTests
#ETAPA 2: Imagen en produccion
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copiar el Jar desde la etapa de compilacion
COPY --from=builder /app/target/ms-cursos-0.0.1-SNAPSHOT.jar .

EXPOSE 8002
# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar","ms-cursos-0.0.1-SNAPSHOT.jar"]
