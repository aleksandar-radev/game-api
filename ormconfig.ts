import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development';
const fileExtension = isProd ? 'js' : 'ts';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [`src/models/*.${fileExtension}`],
  migrations: [`src/database/migrations/*.${fileExtension}`],
  synchronize: false,
};

export const testConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: 'test',
  entities: [`src/models/*.${fileExtension}`],
  migrations: [`src/database/migrations/*.${fileExtension}`],
  synchronize: true,
};
