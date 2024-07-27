import { Exclude, Type } from 'class-transformer';
import { UserResponseDto } from './UserResponseDto';

export class UserDataResponseDto {
  @Exclude()
  user?: UserResponseDto;
  @Exclude()
  created_at?: any;
  @Exclude()
  updated_at?: any;
}
