# ---------- Step 1: build the React app ----------
FROM node:24-alpine AS build
WORKDIR /app

# Copy only the package files first: Docker caches this step,
# so packages are re-downloaded only when package.json / package-lock.json change
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code and build it (creates /app/dist)
COPY . .
RUN npm run build

# ---------- Step 2: serve the built files with nginx ----------
FROM nginx:alpine

# Our config: port 3000 + every URL (/signin, /home, /stream...) returns index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Only the built files go into the final image (no node_modules, no source code)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000
