FROM node:8.9.0

ARG NODE_ENV="production"

RUN mkdir /real-national-problems-node-api
WORKDIR /real-national-problems-node-api

COPY . .

RUN npm install nodemon -g
RUN npm install -g sequelize-cli
RUN npm install

EXPOSE 3000

CMD npm start