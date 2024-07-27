import { Request, Response, NextFunction } from 'express';

export const sendCreated = (res: Response, data: any): Response => {
  return res.status(201).send(data);
};

export const sendBadRequest = (res: Response, message: string): Response => {
  return res.status(400).send({
    success: false,
    message: message,
  });
};

export const sendUnauthorized = (res: Response, message: string): Response => {
  return res.status(401).send({
    success: false,
    message: message,
  });
};

export const sendForbidden = (res: Response): Response => {
  return res.status(403).send({
    success: false,
    message: 'You do not have rights to access this resource.',
  });
};

export const sendNotFound = (res: Response): Response => {
  return res.status(404).send({
    success: false,
    message: 'Resource not found.',
  });
};

export const setHeadersForCORS = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Access-Token, Content-Type, Accept');
  next();
};

export default {
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  setHeadersForCORS,
};
