FROM node:20-alpine

RUN apk update
RUN apk update && apk add --no-cache curl

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev:watch"]