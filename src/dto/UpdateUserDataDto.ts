import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDataRequestDto {
  @IsString()
  data_json?: any;
}
