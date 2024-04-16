import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "../helpers/error";
import { AuthRequest } from "../helpers/request";
import UserRepository from "../repositories/UserRepository";
import Container from "typedi";

export const authMiddleware = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRepository = Container.get(UserRepository);
      let token = req.cookies.jwt;

      if (!token) {
        throw new AuthenticationError("Token not found");
      }

      const jwtSecret = process.env.JWT_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded || !decoded.userId) {
        throw new AuthenticationError("UserId not found");
      }

      const user = await userRepository.findUserById(decoded.userId);

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      req.user = user;
      next();
    } catch (e) {
      throw new AuthenticationError("Invalid token or not logged in");
    }
  }
);

export default authMiddleware;
