FROM node:12-alpine

RUN yarn global add pnpm@4.14.4

WORKDIR /usr/src/app

COPY ./ .