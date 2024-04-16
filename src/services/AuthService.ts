import { UserRepository } from "./../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser, User } from "../models/User";
import { BadRequestError } from "../helpers/error";
import BaseService from "./BaseService";
import { Inject, Service } from "typedi";

@Service()
export class AuthService extends BaseService {
  constructor(@Inject() private userRepository: UserRepository) {
    super();
  }
  generateToken = (res: Response, user: IUser | undefined) => {
    if (!user) {
      throw new Error("Fatal error. id not found !? #generateToken");
    }
    const userId = user.id;
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
  };

  clearToken = (res: Response) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  };

  comparePassword = (password: string, user: IUser) => {
    return bcrypt.compare(password, user.password);
  };

  validateRegistration = async (
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

    const userExists = await this.userRepository.findUserByEmail(email);

    if (userExists) {
      throw new BadRequestError("User already exists");
    }
  };

  createUser = async (username: string, email: string, password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = await this.userRepository.createUser(
      new User({ username, email, password: hashedPassword })
    );
    const user = await this.userRepository.findUserById(userId);

    return user;
  };
}

export default AuthService;
