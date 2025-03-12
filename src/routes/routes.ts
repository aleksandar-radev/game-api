import express, { Request, Response } from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { UserController } from '../controllers/UserController';
import Container from 'typedi';
import { ErrorMiddleware } from '../middleware/ErrorMiddleware';
import { GameDataController } from '../controllers/GameDataController';
import { GameController } from '../controllers/GameController'; // Add this import

export const addRoutes = (app: express.Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.send(`API is running... \nEnvironment: ${process.env.ENV}`);
  });

  useContainer(Container);

  useExpressServer(app, {
    controllers: [UserController, GameDataController, GameController],
    middlewares: [ErrorMiddleware],
    routePrefix: '/api',
    defaultErrorHandler: false, // Disable default error handling
  });
};
