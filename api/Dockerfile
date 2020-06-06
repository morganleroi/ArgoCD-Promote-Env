FROM node:14.4.0-alpine3.11

RUN apk update && apk upgrade && \
    apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY tsconfig*.json ./

COPY src src

RUN npm run build

EXPOSE 8080

CMD ["node", "./dist/server.js"]