import express, { Request, Response } from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import Container from "typedi";
import { ErrorMiddleware } from "../middleware/ErrorMiddleware";

const addRoutes = (app: express.Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send(`API is running... \nEnvironment: ${process.env.ENV}`);
  });

  useContainer(Container);

  useExpressServer(app, {
    controllers: [AuthController, UserController],
    middlewares: [ErrorMiddleware],
    defaultErrorHandler: false, // Disable default error handling
  });
};

export default addRoutes;
