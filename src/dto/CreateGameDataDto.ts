import { IsIn, IsOptional, IsString, IsJSON } from 'class-validator';
import { LeaderboardStats } from '../types/LeaderboardStats';
import { GameData } from '../entities/GameData';

export class CreateGameDataDto {
  @IsOptional()
  @IsJSON()
    leaderboard_stats?: LeaderboardStats;

  @IsOptional()
  @IsString()
  @IsIn([GameData.PREMIUM_NO, GameData.PREMIUM_YES, GameData.PREMIUM_TEST])
    premium: string = GameData.PREMIUM_NO;

  @IsOptional()
    data_json: any;

  @IsString()
    game_name?: string;
}
