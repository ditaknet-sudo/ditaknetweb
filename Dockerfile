# syntax=docker/dockerfile:1.7
# ==========================================================================
# DitakNet public website + customer portal (Next.js 15 / Prisma)
# Multi-stage image: deps -> build -> runtime (small production image).
# ==========================================================================

# --- Stage 1: install dependencies (cacheable) ---------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Prisma on Alpine needs OpenSSL to generate the engine.
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json* ./
# Prisma schema is copied before install so `postinstall`/generate can run.
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund


# --- Stage 2: build the Next.js production bundle -------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build


# --- Stage 3: minimal runtime image --------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl tini \
    && addgroup -S nodejs -g 1001 \
    && adduser -S nextjs -u 1001 -G nodejs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Bring across only what the runtime actually needs.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Runtime-writable folders. The compose file mounts volumes on top of these.
RUN mkdir -p /app/data /app/logs /app/backups \
    && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# tini gives us clean signal handling for graceful shutdowns.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start"]
