import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserNameDto {
  @Expose()
    username?: string;
}
