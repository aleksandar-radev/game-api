import { IsInt, IsJSON, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDataRequestDto {
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
  premium?: string;

  @IsOptional()
  @IsString()
  data_json?: any;
}
