# Build step
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve build files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
