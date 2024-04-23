import pagination from "../helpers/pagination";
import { Response } from "express";
import db from "../database/database";
import { AuthRequest } from "../helpers/request";
import BaseController from "./BaseController";
import { Service, Inject } from "typedi";
import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseBefore,
  Body,
  HttpCode,
} from "routing-controllers";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import AuthService from "../services/AuthService";
import { AuthenticationError, BadRequestError } from "../helpers/error";
import UserRepository from "../repositories/UserRepository";

@Controller("/api/user")
@Service()
class UserController extends BaseController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userRepository: UserRepository
  ) {
    super();
  }

  @Post("/register")
  @HttpCode(201)
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
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post("/login")
  @HttpCode(200)
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
    return user;
  }

  @Post("/logout")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    this.authService.clearToken(res);
    return "Successfully logged out";
  }

  @Get("/")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async getUsers(@Req() req: AuthRequest) {
    return this.getAll(req, "users");
  }

  @Get("/:id")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async getUser(@Req() req: AuthRequest) {
    return this.getById(req, "users");
  }
}

export default UserController;
