# Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies with exact versions
RUN npm ci

# Copy source files
COPY . .

# Build application
RUN npm run build

# Production Stage
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist

# Copy environment file
COPY .env.example.production .env

# Create non-root user
RUN addgroup -g 1001 nestjs && \
    adduser -S -u 1001 -G nestjs nestjs

# Set ownership
RUN chown -R nestjs:nestjs /usr/src/app

# Switch to non-root user
USER nestjs

# Set production environment and default port
ENV NODE_ENV=production \
    PORT=80

# Start application
CMD [ "node", "dist/main" ] 