# Stage 1: Build
FROM node:22-alpine AS builder

# Enable Corepack for pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine

# Enable Corepack for pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 8080

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/server.js"]
