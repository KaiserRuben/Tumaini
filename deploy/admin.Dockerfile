FROM node:20-slim AS build
WORKDIR /app
COPY admin/package.json ./
RUN npm install --include=optional
COPY admin/index.html admin/vite.config.ts admin/tsconfig.json ./
COPY admin/src ./src
COPY admin/public ./public
RUN npx vite build

FROM nginx:alpine
COPY deploy/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
