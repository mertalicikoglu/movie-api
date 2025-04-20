# Dockerfile

# Stage 1: Install Dependencies and Build Code
# Use official Node.js Alpine Linux based image, which is smaller
FROM node:18-alpine AS builder

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json files
# Copying only these files and running install here allows
# npm install step to be cached as long as package.json hasn't changed
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy remaining application source code
COPY . .

# Build TypeScript code
RUN npm run build # Make sure build script in package.json is "tsc" or similar

# Stage 2: Create Production Environment Image
# Use smaller Node.js production image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json files (for prod dependencies)
# NOTE: If not all dependencies are needed in production,
# you can run npm install --only=production in builder stage and copy those node_modules.
# However, typically in backend projects all dependencies are used in production.
COPY package*.json ./

# Install only production dependencies (optional - if all were installed in builder stage, this can be skipped or use --only=production)
# RUN npm install --only=production
# Or if we want to use dependencies from builder stage:
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled code (dist folder) from builder stage
COPY --from=builder /app/dist ./dist

# You can copy .env file or configuration for environment variables.
# However, instead of putting .env file directly in image, it's more secure to use
# Docker secrets, config maps or -e (environment variables) when running container.
# We're copying config file here as an example:
COPY --from=builder /app/src/infrastructure/config ./src/infrastructure/config
COPY .env.example ./.env.example

# Specify port the app will run on (For documentation, doesn't actually expose the port)
# Should match PORT variable in config/index.ts
EXPOSE 3000

# Set default Redis environment variables (can be overridden when running container)
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
# ENV REDIS_PASSWORD=your_password_here (uncomment and set if using password)

# Command to run the application
# Make sure start script in package.json is something like "node dist/server.js"
CMD ["npm", "start"]
# Or you can use node command directly:
# CMD ["node", "dist/server.js"]