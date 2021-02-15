FROM node:12.20.0

ARG build_env='dev'
ENV BUILD_ENV=$build_env

COPY ./ /app
WORKDIR /app

EXPOSE 3000

RUN apt-get update;
RUN rm -rf ./node_modules

RUN bash -c "npm install"

CMD bash -c "npm run ${BUILD_ENV}"
