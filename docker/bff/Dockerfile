FROM node:17.5.0-alpine AS node-mount

COPY ./package-lock.json /package-lock.json
COPY ./apps/bff/package.json /src/package.json
COPY ./apps/bff/package-lock.json /src/package-lock.json

FROM node-mount AS node-install
WORKDIR /src
RUN npm ci

FROM node-install AS node-build
RUN npm run build

FROM node-build AS node-prod
EXPOSE 8080
CMD npm run start:prod