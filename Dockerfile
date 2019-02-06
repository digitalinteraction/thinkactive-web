# Start with a node 9 image with package info
# Installs *all* npm packages and runs build script
FROM node:10-alpine as builder
WORKDIR /app
COPY [ "package.json", "package-lock.json", "/app/" ]
RUN npm ci
COPY [ ".", "/app/" ]
RUN npm run build > /dev/null

# Swaps to nginx and copies the compiled html ready to be serverd
# Also sets the startup script to our custom one which injecs variables
FROM robbj/configurable-nginx:0.1.0
COPY --from=builder /app/dist /usr/share/nginx/html
