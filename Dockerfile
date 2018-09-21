FROM node:9-alpine
MAINTAINER Nossas <tech@nossas.org>

ENV NODE_ENV production
WORKDIR /code

COPY package.json /code
COPY package-lock.json /code
RUN npm i

COPY . /code
