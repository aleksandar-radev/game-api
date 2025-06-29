import { IsJSON, IsOptional, IsString } from 'class-validator';
import { LeaderboardStats } from '../types/LeaderboardStats';

export class GameDataDto {
  @IsOptional()
  @IsJSON()
    leaderboard_stats?: LeaderboardStats;

  @IsOptional()
  @IsString()
    premium?: string;

  @IsOptional()
  @IsJSON()
    data_json!: any;

  @IsOptional()
    game?: any;
}
