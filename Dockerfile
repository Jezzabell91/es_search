FROM node:14-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY . ./

RUN npm install

CMD npm run start


