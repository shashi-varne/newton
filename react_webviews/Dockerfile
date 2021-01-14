FROM debian:latest

ARG build_env='dev'
ENV BUILD_ENV=$build_env

COPY ./ /app
WORKDIR /app

EXPOSE 3000

RUN apt-get update;
RUN apt-get install -y curl;
RUN apt-get install -y unzip;

RUN rm -rf ./node_modules
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
RUN export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
RUN chmod a+x /root/.nvm/nvm.sh
RUN bash -c ". /root/.nvm/nvm.sh \
    && nvm install 12.20.0 && nvm alias default 12.20.0 \
    && npm config set strict-ssl false"

RUN bash -c ". /root/.nvm/nvm.sh && npm install"

CMD bash -c ". /root/.nvm/nvm.sh && npm run ${BUILD_ENV}"
