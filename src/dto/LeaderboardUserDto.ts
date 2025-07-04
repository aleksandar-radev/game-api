import { Expose } from 'class-transformer';

export class LeaderboardUserDto {
  @Expose()
    username?: string;
}
