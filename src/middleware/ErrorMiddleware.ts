import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  BadRequestError as RoutingControllersBadRequestError,
  HttpError,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import {
  AuthenticationError,
  BadRequestError,
  IRoutingControllersBadRequestError,
} from "../helpers/error";
import { Service } from "typedi";
import { MulterError } from "multer";

@Middleware({ type: "after" })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Error Middleware", err.message, err.stack);

    if (err instanceof AuthenticationError) {
      return res
        .status(401)
        .json({ message: err.message || "You're not authorized" });
    }

    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message || "Request failed" });
    }

    if (err instanceof MulterError) {
      return res
        .status(400)
        .json({ message: err.message || "Bad request data" });
    }

    if (err instanceof RoutingControllersBadRequestError) {
      const customError = err as IRoutingControllersBadRequestError;
      if (customError.errors) {
        const { httpCode, message, errors } = customError;
        const validationErrors = errors.map((error: any) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        // Create a custom error response object
        const errorResponse = {
          status: httpCode,
          message: message,
          errors: validationErrors,
        };
        console.log(errorResponse);
        return res.status(httpCode).json(errorResponse);
      }
    }

    logger.error(err);
    if (process.env.ENV !== "production") {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
