FROM node:12.18.3

RUN addgroup --gid 1000 build && adduser --uid 1000 --gid 1000 --disabled-password --gecos "" build
RUN npm install --global yarn 
