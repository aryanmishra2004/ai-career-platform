FROM node:20-alpine AS builder

WORKDIR /app

COPY client/package*.json ./client/
COPY client ./client

WORKDIR /app/client
RUN npm ci
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/client/dist ./dist

EXPOSE 7860

CMD ["serve", "-s", "dist", "-l", "7860"]
