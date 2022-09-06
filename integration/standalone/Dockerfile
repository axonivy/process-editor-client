FROM mcr.microsoft.com/playwright:v1.25.1-jammy

RUN apt-get update && \
  apt-get install software-properties-common -y && \
  apt-add-repository universe -y && \
  apt-get update && \
  apt-get install maven -y && \
  apt-get install openjdk-17-jdk -y 
