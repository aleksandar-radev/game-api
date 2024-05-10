import { CreateUserDataDto } from "../dto/CreateUserDataDto";
import { UpdateUserDataRequestDto } from "../dto/UpdateUserDataDto";
import { BaseService } from "./BaseService";
import { Inject, Service } from "typedi";
import { UserDataRepository } from "../repositories/UserDataRepository";
import { BadRequestError } from "../helpers/error";
import { PlainData } from "simple-crypto-js";
import { UserData } from "../models/UserData";
import { UserDataDto } from "../dto/UserDataDto";

@Service()
export class UserDataService extends BaseService {
  constructor(@Inject() private userDataRepository: UserDataRepository) {
    super();
  }

  validateDataJson(dataJson: string) {
    let json;
    if (!dataJson) {
      throw new BadRequestError("Data JSON is required");
    }
    try {
      json = JSON.parse(dataJson);
    } catch (e) {
      throw new BadRequestError("Data JSON is invalid");
    }

    // if (!json.name) {
    //   throw new BadRequestError("Data JSON name is required");
    // }
  }
  formatDataJson(decryptedData: any): UserDataDto {
    const parsedData = decryptedData;
    // Format the decrypted data and return a UserDataDto object
    const formattedData: UserDataDto = {
      highest_level: parsedData.highest_level,
      total_experience: parsedData.total_experience,
      total_gold: parsedData.total_gold,
      premium: parsedData.premium,
      data_json: parsedData,
    };

    return formattedData;
  }
}
