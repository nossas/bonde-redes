FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

# RUN pnpm m i --filter bonde-microservices --filter bonde-webhooks-mautic-zendesk

# RUN pnpm m run build --filter bonde-webhooks-mautic-zendesk

CMD node ./packages/webhooks-mautic-zendesk/dist
