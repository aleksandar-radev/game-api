#!/bin/bash
cd "$(dirname "$0")/.."

# Function to display usage
show_usage() {
  echo "Usage: pnpm <script_type> [<command>]"
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

# Determine the connection file based on NODE_ENV
if [ "$NODE_ENV" != 'local' ]; then
  CONNECTION_FILE="./dist/src/database/connection.js"
else
  CONNECTION_FILE="./src/database/connection.ts"
fi

#  source .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found. Please ensure it exists."
  exit 1
fi

# Handle different script types
case $SCRIPT_TYPE in
migration)
  case $COMMAND in
  generate)
    if [ "$NODE_ENV" != 'local' ]; then
      npx typeorm migration:generate -d $CONNECTION_FILE ./src/database/migrations/$3
    else
      npx typeorm-ts-node-commonjs migration:generate -d $CONNECTION_FILE ./src/database/migrations/$3
    fi
    ;;
  create)
    if [ "$NODE_ENV" != 'local' ]; then
      npx typeorm migration:create ./src/database/migrations/$3
    else
      npx typeorm-ts-node-commonjs migration:create ./src/database/migrations/$3
    fi
    ;;
  run)
    if [ "$NODE_ENV" != 'local' ]; then
      npx typeorm migration:run -d $CONNECTION_FILE
    else
      npx typeorm-ts-node-commonjs migration:run -d $CONNECTION_FILE
    fi
    ;;
  revert)
    if [ "$NODE_ENV" != 'local' ]; then
      npx typeorm migration:revert -d $CONNECTION_FILE
    else
      npx typeorm-ts-node-commonjs migration:revert -d $CONNECTION_FILE
    fi
    ;;
  show)
    if [ "$NODE_ENV" != 'local' ]; then
      npx typeorm migration:show -d $CONNECTION_FILE
    else
      npx typeorm-ts-node-commonjs migration:show -d $CONNECTION_FILE
    fi
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
