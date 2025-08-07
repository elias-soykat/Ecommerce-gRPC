FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["sh", "-c", "npx sequelize-cli db:migrate && node src/server.js"]