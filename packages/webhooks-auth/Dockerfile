FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-microservices --filter bonde-webhooks-auth

RUN pnpm m run build --filter bonde-webhooks-auth

CMD node ./packages/webhooks-auth/dist
