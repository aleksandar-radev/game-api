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
    if (!dataJson) {
      throw new BadRequestError('Data JSON is required');
    }
    try {
      JSON.parse(dataJson);
    } catch (_e) {
      throw new BadRequestError('Data JSON is invalid');
    }

    // if (!json.name) {
    //   throw new BadRequestError("Data JSON name is required");
    // }
  }
  formatDataJson(decryptedData: any): GameDataDto {
    const parsedData = decryptedData;
    // Format the decrypted data and return a GameDataDto object
    const stats = parsedData.leaderboardStats || {};
    const formattedData: GameDataDto = {
      leaderboard_stats: {
        highestScore: stats.highestScore ?? 0,
        highestLevel: stats.highestLevel ?? 0,
        highestStage: stats.highestStage ?? 0,
        totalKills: stats.totalKills ?? 0,
        totalGold: stats.totalGold ?? 0,
      },
      premium: parsedData.premium || 'no',
      data_json: parsedData || {},
    };

    return formattedData;
  }

  async getLeaderboardData() {
    const leaderboardData = await this.gameDataRepository
      .createQueryBuilder('gd')
      .leftJoinAndSelect('gd.user', 'user')
      .orderBy("gd.leaderboard_stats->>'highestScore'", 'DESC')
      .limit(100)
      .getMany();

    return leaderboardData.map((data) => {
      const plainData = plainToInstance(LeaderboardGameDataDto, data, {
        excludeExtraneousValues: true,
      });
      return plainData;
    });
  }
}
