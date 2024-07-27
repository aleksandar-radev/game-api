import { BaseService } from './BaseService';
import { Inject, Service } from 'typedi';
import { UserDataRepository } from '../repositories/UserDataRepository';
import { BadRequestError } from '../helpers/error';
import { UserDataDto } from '../dto/UserDataDto';
import { plainToInstance } from 'class-transformer';
import { LeaderboardUserDataDto } from '../dto/LeaderboardUserDataDto';

@Service()
export class UserDataService extends BaseService {
  constructor(@Inject() private userDataRepository: UserDataRepository) {
    super();
  }

  validateDataJson(dataJson: string) {
    let json;
    if (!dataJson) {
      throw new BadRequestError('Data JSON is required');
    }
    try {
      json = JSON.parse(dataJson);
    } catch (e) {
      throw new BadRequestError('Data JSON is invalid');
    }

    // if (!json.name) {
    //   throw new BadRequestError("Data JSON name is required");
    // }
  }
  formatDataJson(decryptedData: any): UserDataDto {
    const parsedData = decryptedData;
    // Format the decrypted data and return a UserDataDto object
    const formattedData: UserDataDto = {
      highest_level: parsedData.highestLevel || 0,
      total_experience: parsedData.totalExperience || 0,
      total_gold: parsedData.totalGold || 0,
      premium: parsedData.premium || 'no',
      data_json: parsedData || {},
    };

    return formattedData;
  }

  async getLeaderboardData() {
    const leaderboardData = await this.userDataRepository.find({
      order: { highest_level: 'DESC' },
      relations: ['user'],
      take: 100,
    });

    return leaderboardData.map((data) => {
      const plainData = plainToInstance(LeaderboardUserDataDto, data, {
        excludeExtraneousValues: true,
      });
      return plainData;
    });
  }
}
