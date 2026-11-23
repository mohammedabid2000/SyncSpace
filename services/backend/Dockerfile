# Stage 1: Install all dependencies

FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Build the NestJS application

FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production dependencies only

FROM node:22-alpine AS prod-deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Stage 4: Production runner

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

USER node

COPY --chown=node:node package*.json ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
