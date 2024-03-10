import knex from "knex";
import knexConfig from "../../knexfile"; // Adjust the import path to where your knexfile is located

// Initialize Knex with the environment-specific configuration
const db = knex(knexConfig);

export default db;
