import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

// Use Pool for connection pooling (recommended for most scenarios)
const database = new Pool({
  host: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  port: parseInt(process.env.DB_PORT!),
});

// Alternatively, if you prefer using Client for a single standalone connection:
// import { Client } from 'pg';
// const database = new Client({
//   user: 'myuser',
//   password: 'mypassword',
//   host: 'localhost',
//   port: 5432,
//   database: 'mydatabase'
// });
// await database.connect();

export const query = (text: string, params?: Array<any>) =>
  database.query(text, params);

// Exporting the database instance if needed elsewhere
export { database };

export default {
  query,
};
