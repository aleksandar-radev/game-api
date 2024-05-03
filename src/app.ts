import express, { Application, Express } from "express";
import "reflect-metadata";
import logger from "./config/logger";
import multer from "multer";
import cookieParser from "cookie-parser";
import { addRoutes } from "./routes/routes";
import dotenv from "dotenv";
import { AppDataSource } from "./database/connection";

export async function createApp(): Promise<Application> {
  dotenv.config();
  const app: Express = express();
  const PORT =
    process.env.NODE_ENV === "test" ? 3001 : process.env.PORT || 3000;

  if (!PORT) {
    throw new Error("PORT is not defined");
  }

  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

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

  return app;
}

export default createApp;
