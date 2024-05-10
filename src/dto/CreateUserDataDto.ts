import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { UserData } from "../models/UserData";

export class CreateUserDataDto {
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
  @IsIn([UserData.PREMIUM_NO, UserData.PREMIUM_YES, UserData.PREMIUM_TEST])
  premium: string = UserData.PREMIUM_NO;

  @IsOptional()
  data_json: any;
}
