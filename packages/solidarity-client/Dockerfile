FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

# RUN pnpm m i --filter bonde-microservices --filter solidarity-client

# RUN pnpm m run build --filter solidarity-client

# CMD node ./packages/solidarity-client/server/dist

CMD pnpm m run start --filter solidarity-client