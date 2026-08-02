# ==============================================================================
# Enterprise Production Multi-Stage Dockerfile - Next.js Frontend
# ==============================================================================

# --- Stage 1: Build Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- Stage 2: Next.js Static & Standalone Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN npm run build

# --- Stage 3: Minimal Standalone Production Execution Image ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Security hardening: Non-root user setup
RUN addgroup -S nextjsgroup && adduser -S nextjsuser -G nextjsgroup

# Copy standalone output from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next/standalone ./
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next/static ./.next/static

USER nextjsuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
