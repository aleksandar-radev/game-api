import { Pool } from "pg";

// Use Pool for connection pooling (recommended for most scenarios)
const database = new Pool({
  user: "myuser",
  password: "mypassword",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "mydatabase",
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
