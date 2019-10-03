FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices bonde-webhooks-solidarity-count

RUN pnpm m run build --filter bonde-webhooks-solidarity-count

CMD node ./packages/webhooks-solidarity-count/dist
