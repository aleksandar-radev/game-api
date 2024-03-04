#!/bin/bash

# Navigate to the script's directory (in case script is ran from a different directory)
cd "$(dirname "$0")"

# Pull the latest changes from Git
git fetch
git reset --hard origin/main

# Then navigate one directory up to where docker-compose.yml is expected to be
cd ..

# Add the .env file to the project's root directory
mv ./env/app1/.env.production "$(dirname "$0")"
mv .env.production .env

# Rebuild the Docker image for app1
docker-compose build app1

# Restart app1 without affecting its dependencies
docker-compose up -d --no-deps app1
