import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { MembersModule } from '../src/members/members.module';
import { MembersService } from '../src/members/members.service';
import { MemberRole } from '../src/common/enums/member-role.enum';
import { AuthService } from '../src/auth/auth.service';
import { Member } from '../src/entities/member.entity';
import { Directory } from '../src/entities/directory.entity';
import { Proposal } from '../src/entities/proposal.entity';
import { ProposalVersion } from '../src/entities/proposal-version.entity';
import { Issue } from '../src/entities/issue.entity';
import { PullRequest } from '../src/entities/pull-request.entity';
import { VoteSession } from '../src/entities/vote-session.entity';
import { Vote } from '../src/entities/vote.entity';
import { AuditLog } from '../src/entities/audit-log.entity';

describe('AuthService', () => {
  let membersService: MembersService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [
            Member,
            Directory,
            Proposal,
            ProposalVersion,
            Issue,
            PullRequest,
            VoteSession,
            Vote,
            AuditLog,
          ],
        }),
        MembersModule,
        AuthModule,
      ],
    }).compile();

    membersService = moduleRef.get(MembersService);
    authService = moduleRef.get(AuthService);

    await membersService.create({
      name: 'Maria Souza',
      email: 'maria@example.com',
      partyId: 'PRT-100',
      password: 'changeme',
      role: MemberRole.COORDENADOR,
      ecpfId: '12345678900',
    });
  });

  it('logs in with party credentials', async () => {
    const result = await authService.loginWithPartyCredentials('PRT-100', 'changeme');
    expect(result.accessToken).toBeDefined();
    expect(result.member.role).toBe(MemberRole.COORDENADOR);
  });

  it('logs in with e-CPF token', async () => {
    const tokenPayload = Buffer.from(
      JSON.stringify({ sub: '12345678900', iss: 'ecpf.gov' }),
      'utf-8',
    ).toString('base64');
    const result = await authService.loginWithEcpf(tokenPayload);
    expect(result.accessToken).toBeDefined();
    expect(result.member.role).toBe(MemberRole.COORDENADOR);
  });
});
