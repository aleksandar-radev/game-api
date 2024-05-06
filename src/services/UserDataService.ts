import { CreateUserDataDto } from "../dto/CreateUserDataDto";
import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";
import { BaseService } from "./BaseService";
import { Inject, Service } from "typedi";
import { UserDataRepository } from "../repositories/UserDataRepository";

@Service()
export class UserDataService extends BaseService {
  constructor(@Inject() private userDataRepository: UserDataRepository) {
    super();
  }
}
