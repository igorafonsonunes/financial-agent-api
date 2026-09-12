FROM node:22-alpine

RUN apk add --no-cache poppler-utils tesseract-ocr tesseract-ocr-data-por

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
