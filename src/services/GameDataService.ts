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

    let leaderboard_stats = {
      highestScore: 0,
      highestLevel: 0,
      highestStage: 0,
      totalKills: 0,
      totalGold: 0,
    };

    if (!parsedData.options?.resetRequired) {
      leaderboard_stats = {
        highestScore: 0,
        highestLevel: parsedData.hero.level ?? 0,
        highestStage: 0,
        totalKills: 0,
        totalGold: 0,
      };
    }

    const formattedData: GameDataDto = {
      leaderboard_stats,
      premium: parsedData.premium || 'no',
      data_json: parsedData || {},
    };

    return formattedData;
  }

  async getLeaderboardData(gameName?: string) {
    if (!gameName) {
      return [];
    }
    // Select only leaderboard_stats and user fields, order numerically by highestLevel
    let query = this.gameDataRepository
      .createQueryBuilder('gd')
      .select([
        'gd.leaderboard_stats',
        'user.id',
        'user.username',
      ])
      .leftJoin('gd.user', 'user')
      .leftJoin('gd.game', 'game')
      .where('game.name = :gameName', { gameName })
      .andWhere('(gd.leaderboard_stats->>\'highestLevel\')::int > 0')
      .orderBy('(gd.leaderboard_stats->>\'highestLevel\')::int', 'DESC')
      .limit(100);

    const leaderboardData = await query.getRawMany();
    // Map to DTOs
    const leaderboardDataFormatted = leaderboardData.map((data) => {
      const stats = data.gd_leaderboard_stats || {};
      const mapped = {
        highestScore: stats.highestScore ?? 0,
        highestLevel: stats.highestLevel ?? 0,
        highestStage: stats.highestStage ?? 0,
        totalKills: stats.totalKills ?? 0,
        totalGold: stats.totalGold ?? 0,
        user: {
          id: data.user_id,
          username: data.user_username,
        },
      };
      const plainData = plainToInstance(LeaderboardGameDataDto, mapped, {
        excludeExtraneousValues: true,
      });
      return plainData;
    });
    return leaderboardDataFormatted;
  }
}
