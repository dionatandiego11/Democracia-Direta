import { IsDateString, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateVoteSessionDto {
  @IsString()
  proposalId!: string;

  @IsObject()
  weights!: Record<string, number>;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsOptional()
  @IsString()
  blockchainAnchor?: string;
}
