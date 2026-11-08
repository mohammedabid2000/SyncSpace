# stage 1 : build  the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm build


# stage 2 : run the production server

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --onlyproduction
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
