FROM node:latest AS dependencies
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production


FROM node:alpine
COPY --from=dependencies /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

ENTRYPOINT [ "node", "dist/index.js" ]