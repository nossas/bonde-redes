FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-microservices --filter webhook-mail

RUN pnpm m run build --filter webhook-mail

CMD node ./packages/webhook-mail/dist