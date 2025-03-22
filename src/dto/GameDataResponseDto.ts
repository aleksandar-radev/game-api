import { Exclude } from 'class-transformer';
import { UserResponseDto } from './UserResponseDto';

export class GameDataResponseDto {
  @Exclude()
  user?: UserResponseDto;
  @Exclude()
  created_at?: any;
  @Exclude()
  updated_at?: any;
}
