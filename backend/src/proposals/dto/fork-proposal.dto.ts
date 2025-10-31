import { IsOptional, IsString } from 'class-validator';

export class ForkProposalDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
