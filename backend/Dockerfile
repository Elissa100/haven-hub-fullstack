# Use Maven image to build the project
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

RUN mvn clean package -DskipTests

# Use a slim Java image to run the app
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy built jar from the build stage
COPY --from=build /app/target/havenhub-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
