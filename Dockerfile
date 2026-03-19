FROM node:20-alpine AS builder

# 1. Install all system dependencies (Python + Build Tools + OpenSSL for Prisma)
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    jpeg-dev \
    zlib-dev \
    libpng-dev \
    openssl \
    libc6-compat

WORKDIR /app

# 2. Setup Python environment first
RUN python3 -m venv .venv
ENV PATH="/app/.venv/bin:$PATH"
RUN pip install --no-cache-dir "qrcode[pil]"

# 3. Securely handle Prisma dependency before npm ci
# We copy package files AND the prisma folder because npm ci triggers 'postinstall' (prisma generate)
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# 4. Install NPM dependencies (runs prisma generate automatically)
RUN npm ci

# 5. Copy the rest of the application AND build
COPY . .
# We use NEXT_TELEMETRY_DISABLED=1 to avoid build logs bloat
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- RUNTIME STAGE ---
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies only (openssl for prisma)
RUN apk add --no-cache openssl python3 py3-pip

# Copy venv from builder
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy built app and required files
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/qr_generator.py ./

EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000

CMD ["npm", "start"]
