import express, { Application, Express } from 'express';
import 'reflect-metadata';
import logger from './config/logger';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { addRoutes } from './routes/routes';
import dotenv from 'dotenv';
import { Server } from 'http';
import cors from 'cors';

export async function createServer(): Promise<Server> {
  dotenv.config();
  const app: Express = express();
  const PORT = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT || 3000;

  if (!PORT) {
    throw new Error('PORT is not defined');
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(multer().any());
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    }),
  );

  addRoutes(app); // adds all routes from ./routes

  // start server
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // ERROR HANDLING (logging)
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    logger.error('Unhandled Rejection at:', reason);
  });

  return server;
}

export default createServer;
