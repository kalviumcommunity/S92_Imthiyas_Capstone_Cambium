# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — ROOT DOCKERFILE
# Multi-stage, multi-target container build orchestrating full-stack services
# ==============================================================================

# ------------------------------------------------------------------------------
# Target 1: Backend Server Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS server-builder

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

COPY server/tsconfig*.json ./
COPY server/src ./src
RUN npm run build
RUN npm prune --production

# ------------------------------------------------------------------------------
# Target 2: Backend Production Server Runtime
# ------------------------------------------------------------------------------
FROM node:20-alpine AS server

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

RUN mkdir -p uploads/artifacts && chown -R node:node /app
USER node

COPY --chown=node:node --from=server-builder /app/server/package*.json ./
COPY --chown=node:node --from=server-builder /app/server/node_modules ./node_modules
COPY --chown=node:node --from=server-builder /app/server/dist ./dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

CMD ["node", "dist/src/main.js"]

# ------------------------------------------------------------------------------
# Target 3: Frontend Client Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

COPY client/tsconfig.json client/next.config.ts client/tailwind.config.ts client/postcss.config.* ./
COPY client/app ./app
COPY client/components ./components
COPY client/lib ./lib
COPY client/public ./public
COPY client/public_logo ./public_logo
COPY client/scripts ./scripts
COPY client/tokens ./tokens

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ------------------------------------------------------------------------------
# Target 4: Frontend Client Runtime
# ------------------------------------------------------------------------------
FROM node:20-alpine AS client

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

USER node

COPY --chown=node:node --from=client-builder /app/client/public ./public
COPY --chown=node:node --from=client-builder /app/client/.next/standalone ./
COPY --chown=node:node --from=client-builder /app/client/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

# ------------------------------------------------------------------------------
# Default Target: Enterprise Backend Server
# ------------------------------------------------------------------------------
FROM server AS default
