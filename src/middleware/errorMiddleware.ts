import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { AuthenticationError, BadRequestError } from "../helpers/error";
import { Service } from "typedi";

@Middleware({ type: "after" })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Error Middleware", err.stack);

    if (err instanceof AuthenticationError) {
      return res
        .status(401)
        .json({ message: err.message || "You're not authorized" });
    } else if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message || "Request failed" });
    } else {
      logger.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
