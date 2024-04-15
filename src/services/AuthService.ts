import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/User";

const generateToken = (res: Response, userId: number | undefined) => {
  if (!userId) {
    throw new Error("Fatal error. id not found !? #generateToken");
  }

  const jwtSecret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
};

const clearToken = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

const comparePassword = (password: string, user: IUser) => {
  return bcrypt.compare(password, user.password);
};

export { generateToken, clearToken, comparePassword };
