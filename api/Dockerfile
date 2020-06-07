FROM node:14.4.0-alpine3.11

WORKDIR /usr/src/app

# COPY apk/git-2.26.2-r0.apk  git-2.26.2-r0.apk
# # COPY ./apk/git-2.26.2-r0.apk /tmp/git-2.26.2-r0.apk

# # RUN apk add --repositories-file=/dev/null
# RUN apk add --allow-untrusted git-2.26.2-r0.apk

RUN apk update && apk upgrade && \
    apk add --no-cache git

COPY package*.json ./

RUN npm ci

COPY tsconfig*.json ./

COPY src src

RUN npm run build

EXPOSE 8080

CMD ["node", "./dist/server.js"]