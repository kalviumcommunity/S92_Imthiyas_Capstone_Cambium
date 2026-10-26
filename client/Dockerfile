# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — CLIENT DOCKERFILE
# Multi-stage production container for Next.js 15 App Router frontend
# ==============================================================================

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with frozen lockfile
COPY package*.json ./
RUN npm ci

# Copy configuration, source code, design tokens, and static assets
COPY tsconfig.json next.config.ts tailwind.config.ts postcss.config.* ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY public_logo ./public_logo
COPY scripts ./scripts
COPY tokens ./tokens

# Build Next.js standalone application (disabling build telemetry)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Security: Run as unprivileged node user
USER node

# Copy standalone runtime from builder with non-root ownership
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
