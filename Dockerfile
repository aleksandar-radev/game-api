# Stage 1: Build the application

FROM node:22-alpine as builder

WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY ["package.json", "yarn.lock", ".yarnrc.yml", ".env", "./"]

# Enable yarn
RUN corepack enable
RUN yarn set version stable
RUN yarn install
RUN yarn

# Copy the rest of your application code
COPY . .

# Add bash
RUN apk add --no-cache bash

# Build the application
RUN yarn build

# Stage 2: Prepare the production image
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy the build artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY ["package.json", "yarn.lock", ".yarnrc.yml", ".env", "./"]

# Install only production dependencies
RUN corepack enable
RUN yarn set version stable
RUN yarn workspaces focus --production

# Create logs directory and set permissions
RUN mkdir logs

EXPOSE 3010

# Start the application
CMD ["yarn", "start"]

