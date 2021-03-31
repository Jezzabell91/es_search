FROM node:14

WORKDIR /usr/app
COPY package*.json ./
COPY ./src .

RUN npm install

CMD [ "node", "index.js"]


