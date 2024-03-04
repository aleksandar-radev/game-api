import pg from 'pg';
import config from 'config';

const db = new pg({
  user: 'myuser',
  password: 'mypassword',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'mydatabase'
});

module.exports = {
  query: (text, params) => db.query(text, params)
};

exports.db = db;