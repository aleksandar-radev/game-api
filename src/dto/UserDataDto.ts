import { IsJSON, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDataDto {
  @IsOptional()
  @IsNumber()
  highest_level!: number;

  @IsOptional()
  @IsNumber()
  total_experience!: number;

  @IsOptional()
  @IsNumber()
  total_gold!: number;

  @IsOptional()
  @IsString()
  premium!: string;

  @IsOptional()
  @IsJSON()
  data_json!: any;
}
