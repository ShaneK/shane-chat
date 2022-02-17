FROM node:16.13.2

SHELL ["/bin/bash", "-c"]

WORKDIR /usr/src/app

COPY decorate-angular-cli.js ./
COPY package.json ./
RUN npm install

COPY . .
