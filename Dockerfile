# Stage 1: Build the application
FROM node:16.13.1-alpine3.14 as builder

WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY ["package.json", "yarn.lock", "./"]

# Install dependencies
RUN yarn

# Copy the rest of your application code
COPY . .

# Build the application
RUN yarn build 

# Stage 2: Prepare the production image
FROM node:16.13.1-alpine3.14

WORKDIR /usr/src/app

# Copy the build artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY ["package.json", "yarn.lock", "./"]

# Install only production dependencies
RUN yarn --production

# Create a non-root user and switch to it
RUN adduser -D myuser
USER myuser

# Use an ENTRYPOINT script to run commands
ENTRYPOINT ["/bin/sh", "-c", "printenv && ls -la && yarn migrate && yarn start"]

