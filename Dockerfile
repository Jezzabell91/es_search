FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY ./src ./src

CMD npx wait-port http://elasticsearch:9200 &&\
    npm start
