import { Exclude, Expose, Type } from "class-transformer";
import { LeaderboardUserDto } from "./LeaderboardUserDto";

@Exclude()
export class LeaderboardUserDataDto {
  @Expose()
  highest_level!: number;

  @Expose()
  total_experience!: number;

  @Expose()
  total_gold!: number;

  @Expose()
  @Type(() => LeaderboardUserDto)
  user!: LeaderboardUserDto;
}
