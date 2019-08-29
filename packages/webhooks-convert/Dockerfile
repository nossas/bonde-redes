FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --shamefully-flatten -- bonde-microservices bonde-webhooks-convert

RUN pnpm m run build --filter bonde-webhooks-convert

CMD node ./packages/webhooks-convert/dist
