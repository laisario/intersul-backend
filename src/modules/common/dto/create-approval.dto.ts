import { IsNumber, IsNotEmpty, IsBoolean, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateApprovalDto {
  @IsNumber()
  @IsNotEmpty()
  responsable_user_id: number;

  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsNumber()
  @IsOptional()
  step_id?: number;
}
