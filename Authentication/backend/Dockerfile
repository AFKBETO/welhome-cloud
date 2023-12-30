FROM node:latest as node
WORKDIR /app
COPY package.json /app/
COPY db.js /app/
COPY index.js /app/
RUN npm install --production

FROM node as production
EXPOSE 3001
CMD ["npm", "start"]
