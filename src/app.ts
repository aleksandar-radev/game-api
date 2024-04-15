import express, { Express } from "express";
import logger from "./config/logger";
import { errorMiddleware } from "./middleware/errorMiddleware";
import multer from "multer";
import addRoutes from "./routes/routes";

const app: Express = express();
init(app, process);

function init(app: express.Express, process: NodeJS.Process) {
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("PORT is not defined");
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(multer().any());

  addRoutes(app); // adds all routes from ./routes
  app.use(errorMiddleware); // Has to be after all routes!

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
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
}

export default app;
