import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @IsOptional()
  step_id?: number;
}
