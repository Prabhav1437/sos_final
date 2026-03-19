FROM node:20-alpine

# Install Python and Pillow dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    jpeg-dev \
    zlib-dev \
    libpng-dev

WORKDIR /app

# Setup Python Virtual Environment inside /app so Next.js finds it at .venv/bin/python
RUN python3 -m venv .venv
ENV PATH="/app/.venv/bin:$PATH"

# Install Python packages
RUN pip install "qrcode[pil]"

# Install NPM dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the Next.js application
# Next.js may need DATABASE_URL during build depending on config, but mostly during runtime.
RUN npm run build

# Expose the standard port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
