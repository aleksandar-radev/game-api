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

export { AuthenticationError, BadRequestError, DbNotFoundException };
