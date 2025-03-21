# Stage 1: Build the application

FROM node:22-alpine as builder

WORKDIR /usr/src/app

# Copy package.json
COPY ["package.json", "pnpm-lock.yaml", ".env", "./"]

# Install & run pnpm
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of your application code
COPY . .

# Add bash
RUN apk add --no-cache bash

# Build the application
RUN pnpm build

# Stage 2: Prepare the production image
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy the build artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY ["package.json", "pnpm-lock.yaml", ".env", "./"]

# Install & run pnpm
RUN npm install -g pnpm
RUN pnpm build

# Create logs directory and set permissions
RUN mkdir logs

# Start the application
CMD ["pnpm", "start"]

