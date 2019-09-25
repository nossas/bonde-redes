FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices bonde-webhooks-count

RUN pnpm m run build --filter bonde-webhooks-count

CMD node ./packages/webhooks-count/dist
