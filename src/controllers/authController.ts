import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "../helpers/error";
import BaseController from "./BaseController";
import { Inject, Service } from "typedi";
import UserRepository from "../repositories/UserRepository";

@Service()
export class AuthController extends BaseController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userRepository: UserRepository
  ) {
    super();
  }

  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;

    await this.authService.validateRegistration(
      username,
      email,
      password,
      confirmPassword
    );

    const user = await this.authService.createUser(username, email, password);

    this.authService.generateToken(res, user);

    res.status(201).json(user);
  });

  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const passwordMatch = await this.authService.comparePassword(
      password,
      user
    );

    if (!passwordMatch) {
      throw new AuthenticationError("User not found / password incorrect");
    }

    this.authService.generateToken(res, user);
    res.status(200).json(user);
  };

  logoutUser = async (req: Request, res: Response) => {
    this.authService.clearToken(res);
    res.status(200).json({ message: "Successfully logged out" });
  };
}

export default AuthController;
