import { userRepository } from "./../repositories/userRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser, User } from "../models/User";
import { BadRequestError } from "../helpers/error";

export const authService = {
  generateToken: (res: Response, userId: number | undefined) => {
    if (!userId) {
      throw new Error("Fatal error. id not found !? #generateToken");
    }

    const jwtSecret = process.env.JWT_SECRET || "";
    const token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: "30 days",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.ENV !== "local",
      sameSite: "strict",
      maxAge: 30 * 60 * 60 * 24 * 1000,
    });
  },
  clearToken: (res: Response) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  },
  comparePassword: (password: string, user: IUser) => {
    return bcrypt.compare(password, user.password);
  },
  validateRegistration: async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (!username || !email || !password || !confirmPassword) {
      throw new BadRequestError("Please provide all required fields");
    }

    if (password !== confirmPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }

    const userExists = await userRepository.findUserByEmail(email);

    if (userExists) {
      throw new BadRequestError("User already exists");
    }
  },
  createUser: async (username: string, email: string, password: string) => {
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(password, salt);
    const userId = await userRepository.createUser(
      new User({ username, email, password: pwd })
    );
    const user = await userRepository.getUserById(userId);

    return user;
  },
};

export default authService;
