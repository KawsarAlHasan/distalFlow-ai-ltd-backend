# ==========================================
# Base Image
# ==========================================
FROM node:22-alpine AS base

# Install OpenSSL and libc compatibility for Prisma engine binaries
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies first (leverage Docker cache)
COPY package*.json ./
RUN npm install

# Copy Prisma schema and configuration to generate Prisma client
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy application source code and configs
COPY tsconfig.json ./
COPY src ./src

# Ensure uploads and logs directories exist
RUN mkdir -p uploads winston/logs

# Set default environment variables (can be overridden by .env / docker-compose)
ENV NODE_ENV=development
ENV PORT=7811
ENV APP_PORT=7811

EXPOSE 7811

# Start the application
CMD ["npm", "start"]
