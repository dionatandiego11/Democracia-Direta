import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from '../src/members/members.module';
import { MembersService } from '../src/members/members.service';
import { VotesModule } from '../src/votes/votes.module';
import { VotesService } from '../src/votes/votes.service';
import { ProposalsModule } from '../src/proposals/proposals.module';
import { ProposalsService } from '../src/proposals/proposals.service';
import { MemberRole } from '../src/common/enums/member-role.enum';
import { Member } from '../src/entities/member.entity';
import { Directory } from '../src/entities/directory.entity';
import { Proposal } from '../src/entities/proposal.entity';
import { ProposalVersion } from '../src/entities/proposal-version.entity';
import { Issue } from '../src/entities/issue.entity';
import { PullRequest } from '../src/entities/pull-request.entity';
import { VoteSession } from '../src/entities/vote-session.entity';
import { Vote } from '../src/entities/vote.entity';
import { AuditLog } from '../src/entities/audit-log.entity';
import { AuditModule } from '../src/audit/audit.module';

describe('VotesService', () => {
  let membersService: MembersService;
  let votesService: VotesService;
  let proposalsService: ProposalsService;
  let proposalId: string;
  let coordinatorId: string;
  let memberId: string;

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
        AuditModule,
        ProposalsModule,
        VotesModule,
      ],
    }).compile();

    membersService = moduleRef.get(MembersService);
    votesService = moduleRef.get(VotesService);
    proposalsService = moduleRef.get(ProposalsService);

    const coordinator = await membersService.create({
      name: 'Coordenador',
      email: 'coord@example.com',
      partyId: 'COORD-1',
      password: 'password',
      role: MemberRole.COORDENADOR,
    });
    const member = await membersService.create({
      name: 'Filiado',
      email: 'filiado@example.com',
      partyId: 'FIL-1',
      password: 'password',
      role: MemberRole.FILIADO,
    });
    coordinatorId = coordinator.id;
    memberId = member.id;

    const proposal = await proposalsService.createProposal(coordinator, {
      title: 'Votação Importante',
      description: 'Descrição',
      content: 'Conteúdo da proposta',
    });
    proposalId = proposal.id;
  });

  it('applies weighted votes in reports', async () => {
    const coordinator = await membersService.findById(coordinatorId);
    const session = await votesService.createSession(coordinator!, {
      proposalId,
      weights: {
        [MemberRole.COORDENADOR]: 2,
        [MemberRole.FILIADO]: 1,
      },
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
    await votesService.openSession(coordinator!, session.id);
    const member = await membersService.findById(memberId);
    await votesService.castVote(member!, session.id, { choice: 'yes' });
    await votesService.castVote(coordinator!, session.id, { choice: 'no' });
    await votesService.closeSession(coordinator!, session.id);

    const report = await votesService.getReport(session.id);
    expect(report.totals.totalWeight).toBe(3);
    expect(report.totals.choices.yes).toBe(1);
    expect(report.totals.choices.no).toBe(2);
  });
});
