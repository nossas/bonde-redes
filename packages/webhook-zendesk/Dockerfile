FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --shamefully-flatten -- bonde-microservices bonde-webhook-zendesk

RUN pnpm m run build --filter bonde-webhook-zendesk

CMD node ./packages/webhook-zendesk/dist
