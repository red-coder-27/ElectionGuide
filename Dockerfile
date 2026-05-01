# Use official Node.js runtime as base image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY public ./public
COPY src ./src
COPY tests ./tests

# Build the React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/build ./build
COPY public ./public
COPY server.js ./

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "server.js"]
