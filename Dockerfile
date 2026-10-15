FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       openssl \
       ca-certificates \
       poppler-utils \
       tesseract-ocr \
       tesseract-ocr-por \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/data/financial.db

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]