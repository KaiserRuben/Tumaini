FROM node:20-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install --include=optional
COPY index.html vite.config.ts tsconfig.json ./
COPY src ./src
COPY admin/src ./admin/src
COPY api/models ./api/models
RUN npx vite build

FROM nginx:alpine
COPY deploy/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
