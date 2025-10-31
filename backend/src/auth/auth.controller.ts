import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPartyDto } from './dto/login-party.dto';
import { LoginEcpfDto } from './dto/login-ecpf.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/party')
  loginWithParty(@Body() dto: LoginPartyDto) {
    return this.authService.loginWithPartyCredentials(dto.partyId, dto.password);
  }

  @Public()
  @Post('login/ecpf')
  loginWithEcpf(@Body() dto: LoginEcpfDto) {
    return this.authService.loginWithEcpf(dto.token);
  }
}
