import * as dotenv from "dotenv";
dotenv.config();

interface KnexConfig {
  [key: string]: {
    client: string;
    connection: {
      filename?: string;
      host?: string;
      database?: string;
      user?: string;
      password?: string;
      port?: number;
    };
    useNullAsDefault?: boolean;
    pool?: {
      min: number;
      max: number;
    };
    migrations: {
      directory: string;
      tableName: string;
    };
    seeds: {
      directory: string;
    };
  };
}

const environment: string = process.env.ENV || "development";

const config: KnexConfig = {
  local: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      port: parseInt(process.env.DB_PORT!),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/database/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/database/seeds", // Specify the seeds directory
    },
  },
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      port: parseInt(process.env.DB_PORT!),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./dist/database/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./dist/database/seeds", // Specify the seeds directory
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      port: parseInt(process.env.DB_PORT!),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./dist/database/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./dist/database/seeds", // Specify the seeds directory
    },
  },
};

export default config[environment];
