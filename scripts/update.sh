#!/bin/bash

# Function to display usage
show_usage() {
  echo "Usage: yarn <script_type> [<command>]"
  echo "Script types: migration, seed, build"
  echo "Commands for migration: generate, create, run, revert, show"
  echo "Seed and build do not require additional commands"
  exit 1
}

# Check if at least one argument is provided
if [ "$#" -lt 1 ]; then
  show_usage
fi

SCRIPT_TYPE=$1
COMMAND=$2

# Source the .env file
source .env

# Determine the connection file based on NODE_ENV
if [ "$NODE_ENV" = "production" ]; then
  CONNECTION_FILE="./dist/database/connection.js"
else
  CONNECTION_FILE="./src/database/connection.ts"
fi

# Handle different script types
case $SCRIPT_TYPE in
migration)
  case $COMMAND in
  generate)
    yarn typeorm migration:generate -d $CONNECTION_FILE ./src/database/migrations/$3
    ;;
  create)
    cd ./src/database/migrations && yarn typeorm migration:create $3
    ;;
  run)
    yarn typeorm migration:run -d $CONNECTION_FILE
    ;;
  revert)
    yarn typeorm migration:revert -d $CONNECTION_FILE
    ;;
  show)
    yarn typeorm migration:show -d $CONNECTION_FILE
    ;;
  *)
    echo "Invalid command for migration. Use generate, create, run, revert, or show."
    show_usage
    ;;
  esac
  ;;
seed)
  ts-node ./src/database/seeds/RunSeed.ts
  ;;
build)
  rm -rf dist && tsc
  ;;
*)
  echo "Invalid script type. Use migration, seed, or build."
  show_usage
  ;;
esac
