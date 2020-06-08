FROM node:10-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .