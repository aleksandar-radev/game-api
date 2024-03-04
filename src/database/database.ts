import pg from 'pg';
import config from 'config';

const database = new pg({
  user: 'myuser',
  password: 'mypassword',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'mydatabase'
});

module.exports = {
  query: (text, params) => database.query(text, params)
};

exports.database = database;