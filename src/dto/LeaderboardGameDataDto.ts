import { Exclude, Expose, Type } from 'class-transformer';
import { LeaderboardUserDto } from './LeaderboardUserDto';

@Exclude()
export class LeaderboardGameDataDto {
  @Expose()
    highestScore!: number;

  @Expose()
    highestLevel!: number;

  @Expose()
    highestStage!: number;

  @Expose()
    totalKills!: number;

  @Expose()
    totalGold!: number;

  @Expose()
  @Type(() => LeaderboardUserDto)
    user!: LeaderboardUserDto;
}
