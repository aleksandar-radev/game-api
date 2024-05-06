import { BadRequestError as RoutingControllersBadRequestError } from "routing-controllers";

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

class DbNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DbNotFoundException";
  }
}

interface IRoutingControllersBadRequestError
  extends RoutingControllersBadRequestError {
  errors?: any[];
}

export {
  AuthenticationError,
  BadRequestError,
  DbNotFoundException,
  IRoutingControllersBadRequestError,
};
