FROM node:16.15-bullseye

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apt-get update && \
  apt-get install -y libsecret-1-dev && \
  rm -rf /var/lib/apt/lists/*

USER node

RUN npm install -g vsce
RUN npm install -g lock-treatment-tool
