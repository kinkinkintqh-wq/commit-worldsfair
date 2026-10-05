FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY server ./server
COPY scripts ./scripts
COPY web ./web
RUN npm run build && npm prune --omit=dev --ignore-scripts

FROM node:24-bookworm-slim
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/server ./server
COPY --from=build --chown=node:node /app/dist ./dist
RUN mkdir -p /app/.state && chown node:node /app/.state
USER node
ENV COMMIT_WF_MODE=demo COMMIT_WF_HOST=0.0.0.0 COMMIT_WF_PORT=4317
EXPOSE 4317
CMD ["node", "server/index.mjs"]
