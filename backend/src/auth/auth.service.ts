import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MembersService } from '../members/members.service';
import { Member } from '../entities/member.entity';
import { MemberRole } from '../common/enums/member-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginWithPartyCredentials(partyId: string, password: string) {
    const member = await this.membersService.findByPartyId(partyId);
    if (!member) {
      throw new UnauthorizedException('Member not found');
    }
    const memberWithPassword = await this.membersService.findByPartyIdWithPassword(partyId);
    if (!memberWithPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await this.membersService.validatePassword(memberWithPassword, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(member);
  }

  async loginWithEcpf(token: string) {
    const payload = this.decodeMockedOAuthToken(token);
    if (!payload.ecpfId) {
      throw new UnauthorizedException('Invalid token');
    }
    const member = await this.membersService.findByEcpfId(payload.ecpfId);
    if (!member) {
      throw new UnauthorizedException('Member not enrolled for e-CPF');
    }
    return this.generateToken(member, { oauthProvider: payload.issuer });
  }

  private decodeMockedOAuthToken(token: string) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parsed = JSON.parse(decoded);
      return {
        ecpfId: parsed.sub,
        issuer: parsed.iss ?? 'ecpf.oauth',
      };
    } catch (error) {
      throw new UnauthorizedException('Malformed token');
    }
  }

  private async generateToken(member: Member, extra: Record<string, unknown> = {}) {
    const payload = {
      sub: member.id,
      role: member.role,
      ...extra,
    };
    const secret = this.configService.get<string>('JWT_SECRET', 'super-secret-key');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '8h');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
    return {
      accessToken: token,
      member: {
        id: member.id,
        name: member.name,
        role: member.role,
      },
    };
  }

  decodeToken(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET', 'super-secret-key');
    return this.jwtService.verify(token, { secret });
  }

  assertRole(member: Member, roles: MemberRole[]) {
    if (!roles.includes(member.role)) {
      throw new UnauthorizedException('Insufficient permissions');
    }
  }
}
