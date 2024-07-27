import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @Exclude()
  password?: string;
}
