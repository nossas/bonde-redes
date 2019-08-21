FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --shamefully-flatten -- bonde-microservices bonde-webhooks-registry

RUN pnpm m run build --filter bonde-webhooks-registry

CMD node ./packages/webhooks-registry/dist
