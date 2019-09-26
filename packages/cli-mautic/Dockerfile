FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i -- bonde-microservices cli-mautic-forms

RUN pnpm m run build --filter cli-mautic-forms

CMD node ./packages/cli-mautic-forms/dist
