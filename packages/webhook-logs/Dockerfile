FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --shamefully-flatten -- bonde-microservices bonde-webhook-logs

RUN pnpm m run build --filter bonde-webhook-logs

CMD node ./packages/webhook-logs/dist
