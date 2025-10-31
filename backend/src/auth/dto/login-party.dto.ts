import { IsString, MinLength } from 'class-validator';

export class LoginPartyDto {
  @IsString()
  partyId!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
