import { CreateUserDataDto } from "../dto/CreateUserDataDto";
import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";
import { BaseService } from "./BaseService";
import { Inject, Service } from "typedi";
import { UserDataRepository } from "../repositories/UserDataRepository";
import { UserData } from "../models/UserData";

@Service()
export class UserDataService extends BaseService {
  constructor(@Inject() private userDataRepository: UserDataRepository) {
    super();
  }

  async createUserData(userData: CreateUserDataDto) {
    console.log(userData);

    // const createdUserData = await this.userDataRepository.createUserData(
    //   userData
    // );
    // return createdUserData;
  }

  async updateUserData(id: number, userData: UpdateUserDataDto) {
    const updatedUserData = await this.userDataRepository.updateUserData(
      id,
      userData
    );
    return updatedUserData;
  }

  async getUserDataById(id: number) {
    const userData = await this.userDataRepository.getUserDataById(id);
    return userData;
  }
}
