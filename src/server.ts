import { createServer } from './app';
import { AppDataSource } from './database/connection';

createServer();

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
