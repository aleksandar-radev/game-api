import { Response } from "express";
import AuthService from "../services/AuthService";
import { AuthenticationError } from "../helpers/error";
import BaseController from "./BaseController";
import { Inject, Service } from "typedi";
import UserRepository from "../repositories/UserRepository";
import {
  Controller,
  Post,
  UseBefore,
  Body,
  Req,
  Res,
  OnUndefined,
} from "routing-controllers";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AuthRequest } from "../helpers/request";

@Controller("/api/auth")
@Service()
export class AuthController extends BaseController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userRepository: UserRepository
  ) {
    super();
  }

  @Post("/register")
  async register(@Body() body: any, @Res() res: Response) {
    try {
      const { username, email, password, confirmPassword } = body;

      await this.authService.validateRegistration(
        username,
        email,
        password,
        confirmPassword
      );

      const user = await this.authService.createUser(username, email, password);
      this.authService.generateToken(res, user);
      res.status(201).json(user);
    } catch (error) {
      throw error;
    }
  }

  @Post("/login")
  async login(@Body() body: any, @Res() res: Response) {
    const { email, password } = body;

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
  }

  @Post("/logout")
  @UseBefore(AuthMiddleware)
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    this.authService.clearToken(res);
    res.status(200).json({ message: "Successfully logged out" });
  }
}

export default AuthController;
