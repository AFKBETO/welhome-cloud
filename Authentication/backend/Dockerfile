FROM node:20-alpine3.19 as node
WORKDIR /app
COPY package.json /app/
COPY index.js /app/
RUN npm install --production

FROM node as production
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE $PORT 
CMD ["npm", "start"]
