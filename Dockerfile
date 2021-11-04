FROM node:12.18.3

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install -g vsce
RUN npm install -g lock-treatment-tool
