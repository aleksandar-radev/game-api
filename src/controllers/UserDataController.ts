import {
  JsonController,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "routing-controllers";
import { Service } from "typedi";
import { UserDataService } from "../services/user-data.service";
import { CreateUserDataDto } from "../dto/create-user-data.dto";
import { UpdateUserDataDto } from "../dto/update-user-data.dto";

@Service()
@JsonController("/user-data")
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  create(@Body() createUserDataDto: CreateUserDataDto) {
    return this.userDataService.create(createUserDataDto);
  }

  @Get()
  findAll() {
    return this.userDataService.findAll();
  }

  @Get("/:id")
  findOne(@Param("id") id: string) {
    return this.userDataService.findOne(+id);
  }

  @Patch("/:id")
  update(
    @Param("id") id: string,
    @Body() updateUserDataDto: UpdateUserDataDto
  ) {
    return this.userDataService.update(+id, updateUserDataDto);
  }

  @Delete("/:id")
  remove(@Param("id") id: string) {
    return this.userDataService.remove(+id);
  }
}
