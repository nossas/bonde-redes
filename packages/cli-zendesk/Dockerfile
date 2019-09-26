FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices bonde-cli-zendesk

RUN pnpm m run build --filter bonde-cli-zendesk

CMD node ./packages/cli-zendesk/dist
