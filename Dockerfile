# Node.js bazasi
FROM node:18-alpine

# Redis o'rnatish
RUN apk add --no-cache redis

# Ishchi katalog
WORKDIR /app

# Fayllarni nusxalash
COPY package*.json ./
RUN npm install --force

# Loyihani nusxalash
COPY . .

# Loyihani qurish
RUN npm run build

# Port ochish
EXPOSE 3000

# NestJS`ni ishga tushirish
CMD npm run start:dev
