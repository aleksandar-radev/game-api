import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [join(__dirname, 'src', 'entities', '*.{js,ts}')],
  migrations: [join(__dirname, 'src', 'database', 'migrations', '*.{js,ts}')],
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
  entities: [join(__dirname, 'src', 'entities', '*.{js,ts}')],
  migrations: [join(__dirname, 'src', 'database', 'migrations', '*.{js,ts}')],
  synchronize: true,
};
