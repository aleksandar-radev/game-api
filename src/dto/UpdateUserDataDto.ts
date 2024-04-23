import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDataDto {
  @IsInt()
  id!: number;

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
  data_json?: any;
}
