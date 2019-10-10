FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-microservices bonde-webhooks-solidarity-match

RUN pnpm m run build --filter bonde-webhooks-solidarity-match

CMD node ./packages/webhooks-solidarity-match/dist
