# ==============================================================================
# Enterprise Production Dockerfile for Render Backend Service
# ==============================================================================

# --- Stage 1: Build Dependencies & Compile TypeScript ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests & tsconfig from backend app directory
COPY apps/backend/package*.json ./
COPY apps/backend/tsconfig.json ./

# Install all dependencies including TypeScript compiler
RUN npm install

# Copy backend source code
COPY apps/backend/src ./src

# Compile TypeScript to dist/
RUN npm run build

# Prune devDependencies to keep image lightweight
RUN npm prune --production

# --- Stage 2: Production Execution Image ---
FROM node:20-alpine AS runner

ENV NODE_ENV=production \
    PORT=5000

WORKDIR /app

# Security Hardening: Non-root system user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy build artifacts and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Assign ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/livez || exit 1

# Start backend server
CMD ["node", "dist/index.js"]
