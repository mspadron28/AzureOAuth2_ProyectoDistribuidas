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

# Copiar el Jar desde la etapa de comilacion
COPY --from=builder /app/target/auth-server-0.0.1-SNAPSHOT.jar .

EXPOSE 9000
# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar","auth-server-0.0.1-SNAPSHOT.jar"]
