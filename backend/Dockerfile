FROM maven:3.9.5-eclipse-temurin-17-alpine as build

COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /usr/app
COPY --from=build /usr/src/app/target/backend-1.0.0.jar backend.jar
EXPOSE 9090
ENTRYPOINT ["java","-jar","/usr/app/backend.jar", "-Dspring.config.location='file:/usr/app/application.properties'"]
