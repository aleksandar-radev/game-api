import { Controller, Get, Post, Body, Patch, Param } from "routing-controllers";
import { Service } from "typedi";
import { UserDataService } from "../services/UserDataService";
import { CreateUserDataDto } from "../dto/CreateUserDataDto";
import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";

@Service()
@Controller("/user-data")
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post("/")
  create(@Body() createUserDataDto: CreateUserDataDto) {
    return this.userDataService.createUserData(createUserDataDto);
  }

  @Get("/:id")
  findOne(@Param("id") id: number) {
    return this.userDataService.getUserDataById(id);
  }

  @Patch("/:id")
  update(
    @Param("id") id: number,
    @Body() updateUserDataDto: UpdateUserDataDto
  ) {
    return this.userDataService.updateUserData(id, updateUserDataDto);
  }
}
