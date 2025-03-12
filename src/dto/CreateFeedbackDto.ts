import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
