import express, { Express } from 'express';
import 'reflect-metadata';
import logger from './config/logger';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { addRoutes } from './routes/routes';
import dotenv from 'dotenv';
import { Server } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

export async function createServer(): Promise<Server> {
  dotenv.config();
  const app: Express = express();
  const PORT = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT || 3000;

  if (!PORT) {
    throw new Error('PORT is not defined');
  }

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  // Allow configuring request size limits via environment variables.
  // Default to 10mb for JSON/urlencoded and 10 MB for multipart fields.
  const REQUEST_LIMIT = process.env.REQUEST_LIMIT || '10mb';
  const URLENCODED_LIMIT = process.env.URLENCODED_LIMIT || REQUEST_LIMIT;
  const MULTER_FIELD_SIZE_MB = parseInt(process.env.MULTER_FIELD_SIZE_MB || '10', 10);
  const MULTER_FIELD_SIZE = Number.isNaN(MULTER_FIELD_SIZE_MB) ? 10 * 1024 * 1024 : MULTER_FIELD_SIZE_MB * 1024 * 1024;

  app.use(express.json({ limit: REQUEST_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: URLENCODED_LIMIT }));
  // Configure multer limits to avoid huge multipart payloads exhausting memory.
  const upload = multer({ limits: { fieldSize: MULTER_FIELD_SIZE } });
  app.use(upload.any());
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    }),
  );

  addRoutes(app); // adds all routes from ./routes
  app.use('/static', express.static(path.join(__dirname, '../static')));

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
