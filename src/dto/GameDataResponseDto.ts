import { Exclude } from 'class-transformer';
import { UserResponseDto } from './UserResponseDto';

export class GameDataResponseDto {
  @Exclude()
    user?: UserResponseDto;
  @Exclude()
    created_at?: any;
  updated_at?: any;
  data_json?: any;
}
