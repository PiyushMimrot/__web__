
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./dist ./

COPY .env .env

EXPOSE 12580

CMD [ "node", "main.js" ]
