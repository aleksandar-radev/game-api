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

    const formattedData: GameDataDto = {
      leaderboard_stats: {
        highestScore: 0,
        highestLevel: parsedData.hero.level ?? 0,
        highestStage: 0,
        totalKills: 0,
        totalGold: 0,
      },
      premium: parsedData.premium || 'no',
      data_json: parsedData || {},
    };

    return formattedData;
  }

  async getLeaderboardData(gameName?: string) {
    if (!gameName) {
      return [];
    }
    let query = this.gameDataRepository
      .createQueryBuilder('gd')
      .leftJoinAndSelect('gd.user', 'user')
      .leftJoinAndSelect('gd.game', 'game')
      .where('game.name = :gameName', { gameName })
      .andWhere('(gd.leaderboard_stats->>\'highestLevel\')::int > 0')
      .orderBy("gd.leaderboard_stats->>'highestLevel'", 'DESC')
      .limit(100);

    const leaderboardData = await query.getMany();

    const leaderboardDataFormatted = leaderboardData.map((data) => {
      const mapped = {
        highestScore: data.leaderboard_stats?.highestScore ?? 0,
        highestLevel: data.leaderboard_stats?.highestLevel ?? 0,
        highestStage: data.leaderboard_stats?.highestStage ?? 0,
        totalKills: data.leaderboard_stats?.totalKills ?? 0,
        totalGold: data.leaderboard_stats?.totalGold ?? 0,
        user: data.user,
      };
      const plainData = plainToInstance(LeaderboardGameDataDto, mapped, {
        excludeExtraneousValues: true,
      });
      return plainData;
    });
    return leaderboardDataFormatted;
  }
}
