FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

CMD node ./packages/listener-redes/build/src/main.js
