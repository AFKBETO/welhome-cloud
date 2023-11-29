FROM maven:3.9.5-eclipse-temurin-17-alpine as build

COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package

FROM eclipse-temurin:17-jdk-alpine
COPY --from=build /usr/src/app/target/database_service-1.0.2.jar /usr/app/database_service-1.0.2.jar
EXPOSE 9090  
ENTRYPOINT ["java","-jar","/usr/app/database_service-1.0.2.jar"]