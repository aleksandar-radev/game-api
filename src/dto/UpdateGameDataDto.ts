import { IsOptional, IsString } from 'class-validator';

export class UpdateGameDataRequestDto {
  @IsString()
  data_json?: any;
}
