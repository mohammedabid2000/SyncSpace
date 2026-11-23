FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3100

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 3100
CMD ["node", "dist/main.js"]
