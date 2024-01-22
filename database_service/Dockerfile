FROM maven:3.9.5-amazoncorretto-17-debian as build

COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package

FROM amazoncorretto:17-alpine3.19-jdk
WORKDIR /usr/app
COPY --from=build /usr/src/app/target/database_service-1.0.2.jar database_service-1.0.2.jar
EXPOSE 9090
ENTRYPOINT ["java","-jar","/usr/app/database_service-1.0.2.jar", "-Dspring.config.location='file:/usr/app/application.properties'"]
