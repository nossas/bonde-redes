FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-microservices --filter webhook-activists

RUN pnpm m run build --filter webhook-activists

CMD node ./packages/webhook-activists/dist