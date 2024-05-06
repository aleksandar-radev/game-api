import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseBefore,
  Req,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserDataService } from "../services/UserDataService";
import { CreateUserDataDto } from "../dto/CreateUserDataDto";
import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";
import { UserDataRepository } from "../repositories/UserDataRepository";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AuthRequest } from "../helpers/request";

@Service()
@Controller("/user-data")
@UseBefore(AuthMiddleware)
export class UserDataController {
  constructor(
    @Inject() private userDataService: UserDataService,
    @Inject() private userDataRepository: UserDataRepository
  ) {}

  @Post("/")
  async create(
    @Req() req: AuthRequest,
    @Body() createUserDataDto: CreateUserDataDto
  ) {
    const userId = req.user.id;
    const userData = this.userDataRepository.create({
      ...createUserDataDto,
      user: { id: userId },
    });

    const userDataExists = await this.userDataRepository.getByUserIdAndPremium(
      userId,
      userData.premium
    );

    if (userDataExists) {
      throw new Error("User data already exists");
    }

    return await this.userDataRepository.save(userData);
  }

  @Get("/:id")
  async findOne(@Param("id") id: number) {
    return await this.userDataRepository.findOne({ where: { id } });
  }

  @Patch("/:id")
  async update(
    @Param("id") id: number,
    @Body() updateUserDataDto: UpdateUserDataDto
  ) {
    return await this.userDataRepository.updateAndGet(id, updateUserDataDto);
  }
}
