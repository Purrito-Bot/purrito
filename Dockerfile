FROM node:stretch AS dependencies
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production


FROM node:stretch
RUN echo "deb http://www.deb-multimedia.org stretch main non-free deb-src http://www.deb-multimedia.org stretch main non-free" >> /etc/apt/sources.list \
    && apt-get update \
    && apt-get install --allow-unauthenticated deb-multimedia-keyring \
    && apt-get update \
    && apt-get install -y ffmpeg
COPY --from=dependencies /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

ENTRYPOINT [ "node", "dist/index.js" ]