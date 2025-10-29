import { IsOptional, IsString } from 'class-validator';

export class LoginEcpfDto {
  @IsString()
  token!: string;

  @IsOptional()
  @IsString()
  redirectUri?: string;
}
