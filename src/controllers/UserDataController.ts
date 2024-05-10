import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseBefore,
  Req,
  QueryParam,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserDataService } from "../services/UserDataService";
import { CreateUserDataDto } from "../dto/CreateUserDataDto";
import { UpdateUserDataRequestDto } from "../dto/UpdateUserDataDto";
import { UserDataRepository } from "../repositories/UserDataRepository";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AuthRequest } from "../helpers/request";
import { UserRepository } from "../repositories/UserRepository";
import { plainToClass } from "class-transformer";
import { UserDataResponseDto } from "../dto/UserDataResponseDto";
import crypt from "../helpers/crypt";

@Service()
@Controller("/user-data")
@UseBefore(AuthMiddleware)
export class UserDataController {
  constructor(
    @Inject() private userDataService: UserDataService,
    @Inject() private userDataRepository: UserDataRepository,
    @Inject() private userRepository: UserRepository
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

  @Get("/:userId")
  async findOne(
    @Req() req: AuthRequest,
    @Param("userId") userId: number,
    @QueryParam("premium") premium: string = "no"
  ) {
    const loggedInUser = req.user;

    const userData = await this.userDataRepository.findOne({
      where: { user: { id: userId }, premium },
      relations: ["user"],
    });

    if (
      !userData ||
      (userData.user.id !== loggedInUser.id && loggedInUser?.role !== "admin")
    ) {
      throw new Error("User data not found / Unauthorized");
    }

    return plainToClass(UserDataResponseDto, userData);
  }

  @Get("/")
  async findAll(@Req() req: AuthRequest) {
    const loggedInUser = req.user;
    return await this.userDataRepository.find({
      where: { user: { id: loggedInUser.id } },
      relations: ["user"],
    });
  }

  @Patch("/:id")
  async update(
    @Param("id") id: number,
    @Body() updateUserDataDto: UpdateUserDataRequestDto
  ) {
    const decryptedData = crypt.decrypt(updateUserDataDto.data_json);

    const formattedData = this.userDataService.formatDataJson(decryptedData);

    // this.userDataService.validateDataJson(decryptedData);
    return await this.userDataRepository.updateAndGet(id, {
      ...updateUserDataDto,
      data_json: decryptedData,
    });
  }
}
