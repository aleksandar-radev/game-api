// src\app.ts
import express, { Express } from "express";
import "reflect-metadata";
import logger from "./config/logger";
import multer from "multer";
import cookieParser from "cookie-parser";
import addRoutes from "./routes/routes";
import { AppDataSource } from "./database/connection";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

async function init(app: express.Express, process: NodeJS.Process) {
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("PORT is not defined");
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(multer().any());
  app.use(cookieParser());

  addRoutes(app); // adds all routes from ./routes

  // start server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // ERROR HANDLING (logging)
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    logger.error("Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise);
    logger.error("Unhandled Rejection at:", reason);
  });
}

init(app, process);

export default app;
