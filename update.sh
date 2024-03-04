#!/bin/bash

# Navigate to the script's directory (in case script is ran from a different directory)
cd "$(dirname "$0")"

# Pull the latest changes from Git
git fetch
git reset --hard origin/main

# Then navigate one directory up to where docker-compose.yml is expected to be
cd ..

mv ./env/app1/.env.production "$(dirname "$0")"
mv .env.production .env

chmod ug+x update.sh

# Rebuild the Docker image for app1
docker-compose build app1

# Restart app1 without affecting its dependencies
docker-compose up -d --no-deps app1
