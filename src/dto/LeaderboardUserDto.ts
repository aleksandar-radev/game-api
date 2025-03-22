import { Expose } from 'class-transformer';

export class LeaderboardUserDto {
  @Expose()
  email?: string;
}
