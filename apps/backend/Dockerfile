# ==============================================================================
# Enterprise Production Multi-Stage Dockerfile - Backend Microservice
# ==============================================================================

# --- Stage 1: Build Dependencies & Compile TypeScript ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig.json ./

# Clean install all dependencies including devDependencies
RUN npm install

# Copy source code
COPY src/ ./src

# Build production distribution
RUN npm run build

# Prune dev dependencies for lean image
RUN npm prune --production

# --- Stage 2: Minimal Distroless Production Execution Image ---
FROM node:20-alpine AS runner

# Environmental configuration
ENV NODE_ENV=production \
    PORT=5000

WORKDIR /app

# Create non-root system user and group for security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built application assets and production node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Assign permissions to non-root user
RUN chown -R appuser:appgroup /app

# Enforce Non-Root Execution
USER appuser

# Expose internal service port
EXPOSE 5000

# Native Docker Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/livez || exit 1

# Launch microservice
CMD ["node", "dist/index.js"]
