import { IsIn } from 'class-validator';

export class CastVoteDto {
  @IsIn(['yes', 'no', 'abstain'])
  choice!: 'yes' | 'no' | 'abstain';
}
