FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src
COPY angular.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tailwind.config.js ./

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
