# Use an official OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy and build the app
COPY . /app
RUN ./mvnw clean package -DskipTests

# Expose the port
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "target/havenhub-0.0.1-SNAPSHOT.jar"]
