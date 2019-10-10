FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-microservices bonde-webhooks-registry

RUN pnpm m run build --filter bonde-webhooks-registry

CMD node ./packages/webhooks-registry/dist
