import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { GameData } from '../entities/GameData';

export class CreateGameDataDto {
  @IsOptional()
  @IsNumber()
  highest_level?: number;

  @IsOptional()
  @IsNumber()
  total_experience?: number;

  @IsOptional()
  @IsNumber()
  total_gold?: number;

  @IsOptional()
  @IsString()
  @IsIn([GameData.PREMIUM_NO, GameData.PREMIUM_YES, GameData.PREMIUM_TEST])
  premium: string = GameData.PREMIUM_NO;

  @IsOptional()
  data_json: any;
}
