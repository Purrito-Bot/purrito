FROM node:latest

ADD . .

RUN npm ci

RUN npm run build

ENTRYPOINT [ "node", "dist/index.js" ]