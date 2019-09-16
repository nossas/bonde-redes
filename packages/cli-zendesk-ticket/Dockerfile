FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices bonde-webhooks-zendesk-ticket

RUN pnpm m run build --filter bonde-webhooks-zendesk-ticket

CMD node ./packages/webhooks-zendesk-ticket/dist
