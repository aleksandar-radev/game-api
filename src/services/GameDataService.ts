import { BaseService } from './BaseService';
import { Inject, Service } from 'typedi';
import { GameDataRepository } from '../repositories/GameDataRepository';
import { BadRequestError } from '../helpers/error';
import { GameDataDto } from '../dto/GameDataDto';
import { plainToInstance } from 'class-transformer';
import { LeaderboardGameDataDto } from '../dto/LeaderboardGameDataDto';

@Service()
export class GameDataService extends BaseService {
  constructor(@Inject() private gameDataRepository: GameDataRepository) {
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
  formatDataJson(decryptedData: any): GameDataDto {
    const parsedData = decryptedData;
    // Format the decrypted data and return a GameDataDto object
    const formattedData: GameDataDto = {
      highest_level: parsedData.highestLevel || 0,
      total_experience: parsedData.totalExperience || 0,
      total_gold: parsedData.totalGold || 0,
      premium: parsedData.premium || 'no',
      data_json: parsedData || {},
    };

    return formattedData;
  }

  async getLeaderboardData() {
    const leaderboardData = await this.gameDataRepository.find({
      order: { highest_level: 'DESC' },
      relations: ['user'],
      take: 100,
    });

    return leaderboardData.map((data) => {
      const plainData = plainToInstance(LeaderboardGameDataDto, data, {
        excludeExtraneousValues: true,
      });
      return plainData;
    });
  }
}
