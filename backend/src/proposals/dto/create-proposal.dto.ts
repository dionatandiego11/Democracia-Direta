import { IsOptional, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  directoryId?: string;
}
