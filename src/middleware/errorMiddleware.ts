import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof AuthenticationError) {
    return res
      .status(401)
      .json({ message: err.message || "You're not authorized" });
  } else if (err instanceof BadRequestError) {
    return res.status(400).json({ message: err.message || "Request failed" });
  } else {
    logger.error(err.message, err); // Log the error message to the file system
    return res.status(500).json({ message: "Internal Server Error" });
  }

  // next();
};

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export { errorHandler, AuthenticationError, BadRequestError };
