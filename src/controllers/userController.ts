import { Response } from "express";
import { AuthRequest } from "../helpers/request";
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
import { AuthService } from "../services/AuthService";
import { AuthenticationError } from "../helpers/error";
import { UserRepository } from "../repositories/UserRepository";
import { RegisterUserDto } from "../dto/RegisterUserDto";
import { UserResponseDto } from "../dto/UserResponseDto";
import { plainToClass } from "class-transformer";
import { UserDataRepository } from "../repositories/UserDataRepository";

@Controller("/user")
@Service()
export class UserController {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userRepository: UserRepository,
    @Inject() private userDataRepository: UserDataRepository
  ) {}

  @Post("/register")
  @HttpCode(201)
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    const { username, email, password, confirmPassword } = body;

    await this.authService.validateRegistration(
      username,
      email,
      password,
      confirmPassword
    );

    const user = await this.authService.createUser(username, email, password);

    const userData = this.userDataRepository.create({
      user: { id: user.id },
    });
    await this.userDataRepository.save(userData);

    this.authService.generateToken(res, user);
    return user;
  }

  @Post("/login")
  @HttpCode(200)
  async login(@Body() body: any, @Res() res: Response) {
    const { email, password } = body;

    const user = await this.userRepository.findOne({ where: { email } });
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

    return plainToClass(UserResponseDto, user);
  }

  @Get("/session")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async session(@Req() req: AuthRequest, @Res() res: Response) {
    return { user: plainToClass(UserResponseDto, req.user) };
  }

  @Post("/logout")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    this.authService.clearToken(res);
    return { message: "Successfully logged out" };
  }

  @Get("/")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async getUsers(@Req() req: AuthRequest) {
    return this.userRepository.find();
  }

  @Get("/:id")
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async getUser(@Req() req: AuthRequest) {
    const userId = parseInt(req.params.id, 10);
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
