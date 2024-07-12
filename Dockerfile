FROM node:20-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm run audit

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]