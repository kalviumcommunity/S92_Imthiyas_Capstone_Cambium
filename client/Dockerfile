# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — CLIENT DOCKERFILE
# Multi-stage production container for Next.js 15 App Router frontend
# ==============================================================================

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy client source code and assets
COPY tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY public_logo ./public_logo
COPY scripts ./scripts

# Build Next.js standalone application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Security: Non-root user
USER node

# Copy standalone runtime from builder
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
