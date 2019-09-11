FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices bonde-webhooks-zendesk

RUN pnpm m run build --filter bonde-webhooks-zendesk

CMD node ./packages/webhooks-zendesk/dist
