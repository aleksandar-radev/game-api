import * as dotenv from "dotenv";
import { DataSourceOptions } from "typeorm";
dotenv.config();

const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: ["src/models/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
};

export default config;
