import express, { Express, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import logger from "./config/logger";
import { errorHandler } from "./middleware/errorMiddleware";
import multer from "multer";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());

app.get("/", (req: Request, res: Response) => {
  logger.info("API is running...");
  res.send("API is running...");
});

app.use("/", authRoutes);
app.use("/api/users", userRoutes);

// Has to be after all routes!
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
