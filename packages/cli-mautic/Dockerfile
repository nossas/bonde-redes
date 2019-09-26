FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices cli-mautic

RUN pnpm m run build --filter cli-mautic

CMD node ./packages/cli-mautic/dist
