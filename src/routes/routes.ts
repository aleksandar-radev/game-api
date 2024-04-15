import express, { Request, Response } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const addRoutes = (app: express.Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send(`API is running... \nEnvironment: ${process.env.ENV}`);
  });

  app.use("/auth", authRoutes);
  app.use("/api/users", userRoutes);
};

export default addRoutes;
