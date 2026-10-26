# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — SERVER DOCKERFILE
# Multi-stage production container for NestJS 10 enterprise backend API
# ==============================================================================

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies with frozen lockfile
COPY package*.json ./
RUN npm ci

# Copy server source code and TypeScript compiler configuration
COPY tsconfig*.json ./
COPY src ./src

# Build production artifacts
RUN npm run build

# Prune devDependencies to keep runtime image lightweight
RUN npm prune --production

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Prepare storage directories and enforce unprivileged user ownership
RUN mkdir -p uploads/artifacts && chown -R node:node /app

# Security: Run as unprivileged node user
USER node

# Copy built artifacts and production dependencies with non-root ownership
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

CMD ["node", "dist/src/main.js"]
