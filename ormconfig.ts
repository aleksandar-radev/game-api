import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [__dirname + '/src/models/*.{js,ts}'],
  migrations: [`src/database/migrations/*.{js,ts}`],
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
  entities: [__dirname + '/src/models/*.{js,ts}'],
  migrations: [`src/database/migrations/*.{js,ts}`],
  synchronize: true,
};
