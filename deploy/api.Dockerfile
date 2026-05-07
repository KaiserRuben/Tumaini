FROM node:20-alpine AS build
WORKDIR /app
COPY api/package.json api/package-lock.json* api/yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    else npm install; fi
COPY api/tsconfig.json ./
COPY api/index.ts ./
COPY api/routes ./routes
COPY api/models ./models
COPY api/utils ./utils
RUN npx tsc

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY api/package.json api/package-lock.json* api/yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; \
    else npm install --production; fi
COPY --from=build /app/dist ./dist
RUN mkdir -p /uploads /app/tmp && chown -R node:node /uploads /app
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
