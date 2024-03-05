#!/bin/bash

echo "Stopping service... but keeping database ALIVE"
# Determine the environment based on passed argument
ENVIRONMENT=$1

APP_DIR=~/workspace/app1
ENV_DIR=~/workspace/env

DEV_COMPOSE_FILE="docker-compose.dev.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"

# Confirm environment
if [[ $ENVIRONMENT != "dev" ]] && [[ $ENVIRONMENT != "prod" ]]; then
  echo "Invalid environment specified. Use 'dev' or 'prod'."
  exit 1
fi

# Confirm stop if environment is prod
if [ $ENVIRONMENT == "prod" ]; then
  read -p "Are you sure you want to stop production service? (yes/no) " confirmation
  if [[ $confirmation != "yes" ]]; then
    echo "Production service stopping aborted."
    exit
  fi
fi

# Set the compose file based on the environment
if [ $ENVIRONMENT == "dev" ]; then
  COMPOSE_FILE=$DEV_COMPOSE_FILE
  SERVICE_NAME="app1-dev"
elif [ $ENVIRONMENT == "prod" ]; then
  COMPOSE_FILE=$PROD_COMPOSE_FILE
  SERVICE_NAME="app1"
fi

# Navigate to the directory where the docker-compose file is located
cd "${ENV_DIR}"

# Stop the specified service
docker-compose -f $COMPOSE_FILE stop $SERVICE_NAME

echo "$SERVICE_NAME has been stopped."
