import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  BadRequestError as RoutingControllersBadRequestError,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { AuthenticationError, BadRequestError } from "../helpers/error";
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
    } else if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message || "Request failed" });
    } else if (err instanceof MulterError) {
      return res
        .status(400)
        .json({ message: err.message || "Bad request data" });
    } else if (err instanceof RoutingControllersBadRequestError) {
      // Extract the error details from the HttpError
      // const { httpCode, message, errors } = err;
      // // Extract the validation errors
      // const validationErrors = errors.map((error: any) => ({
      //   property: error.property,
      //   constraints: error.constraints,
      // }));
      // Create a custom error response object
      // const errorResponse = {
      //   status: httpCode,
      //   message: message,
      //   errors: errors,
      // };
      // return res.status(httpCode).json(errorResponse);
    } else {
      logger.error(err);
      if (process.env.ENV !== "production") {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
