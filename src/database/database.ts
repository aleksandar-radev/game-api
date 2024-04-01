import knex from "knex";
import knexConfig from "../knexfile"; // Adjust the import path to where your knexfile is located
import logger from "../config/logger";

// Initialize Knex with the environment-specific configuration
const db = knex(knexConfig);

db.on("query-error", (error, query) => {
  console.error("Query error:", query, error);
  logger.error(`Error executing query ${query.sql}:`, error);
});

export default db;
