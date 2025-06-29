import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { LeaderboardUserDto } from './LeaderboardUserDto';

@Exclude()
export class LeaderboardGameDataDto {
  @Expose()
  @Transform(({ obj }) => obj.leaderboard_stats?.highestScore ?? 0)
    highestScore!: number;

  @Expose()
  @Transform(({ obj }) => obj.leaderboard_stats?.highestLevel ?? 0)
    highestLevel!: number;

  @Expose()
  @Transform(({ obj }) => obj.leaderboard_stats?.highestStage ?? 0)
    highestStage!: number;

  @Expose()
  @Transform(({ obj }) => obj.leaderboard_stats?.totalKills ?? 0)
    totalKills!: number;

  @Expose()
  @Transform(({ obj }) => obj.leaderboard_stats?.totalGold ?? 0)
    totalGold!: number;

  @Expose()
  @Type(() => LeaderboardUserDto)
    user!: LeaderboardUserDto;
}
