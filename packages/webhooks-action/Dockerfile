FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-microservices --filter bonde-action

RUN pnpm m run build --filter bonde-action

CMD node ./packages/webhooks-action/dist