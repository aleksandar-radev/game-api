#!/bin/bash

# Determine the environment based on passed argument
ENVIRONMENT=$1  # 'dev' or 'prod'

ENV_DIR=~/workspace/env
APP_DIR=~/workspace/app1

DEV_COMPOSE_FILE="docker-compose.dev.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"

# Confirm environment
if [[ $ENVIRONMENT != "dev" ]] && [[ $ENVIRONMENT != "prod" ]]; then
  echo "Invalid environment specified. Use 'dev' or 'prod'."
  exit 1
fi

# Confirm production deployment if environment is prod
if [ $ENVIRONMENT == "prod" ]; then
  read -p "Are you sure you want to deploy to production? (yes/no) " confirmation
  if [[ $confirmation != "yes" ]]; then
    echo "Production deployment cancelled."
    exit
  fi
fi

# Environment-specific actions
if [ $ENVIRONMENT == "dev" ]; then
  COMPOSE_FILE=$DEV_COMPOSE_FILE
  COMPOSE_SERVICE="app1-dev"
  ENV_FILE=".env.dev"
else
  COMPOSE_FILE=$PROD_COMPOSE_FILE
  COMPOSE_SERVICE="app1"
  ENV_FILE=".env.production"
fi

# Navigate to the script's directory
cd "${APP_DIR}"

# Pull the latest changes from Git
git fetch
git reset --hard origin/main

# Add the .env file to the project's root directory
cp "${ENV_DIR}/app1/${ENV_FILE}" "${APP_DIR}"
mv "${APP_DIR}/${ENV_FILE}" "${APP_DIR}/.env"

# Navigate to where docker-compose.yml is expected to be
cd "${ENV_DIR}"

# Rebuild the Docker image
docker-compose -f $COMPOSE_FILE build $COMPOSE_SERVICE

# Restart service without affecting its dependencies
docker-compose -f $COMPOSE_FILE up -d --no-deps $COMPOSE_SERVICE
