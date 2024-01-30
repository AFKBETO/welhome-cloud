FROM node:18-alpine3.19 as base
WORKDIR /usr/src/app

FROM base as develop
COPY src src
COPY package*.json ./
COPY tsconfig*.json ./
COPY angular.json angular.json
RUN npm ci

FROM develop as build
RUN npm run build --prod && \
    npm prune --production

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/front-end /usr/share/nginx/html
EXPOSE 80
