import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from '../src/members/members.module';
import { ProposalsModule } from '../src/proposals/proposals.module';
import { MembersService } from '../src/members/members.service';
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

describe('ProposalsService', () => {
  let membersService: MembersService;
  let proposalsService: ProposalsService;
  let authorId: string;
  let moderatorId: string;

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
      ],
    }).compile();

    membersService = moduleRef.get(MembersService);
    proposalsService = moduleRef.get(ProposalsService);

    const author = await membersService.create({
      name: 'Autor',
      email: 'autor@example.com',
      partyId: 'AUTH-1',
      password: 'password',
      role: MemberRole.FILIADO,
    });
    const moderator = await membersService.create({
      name: 'Moderador',
      email: 'moderador@example.com',
      partyId: 'MOD-1',
      password: 'password',
      role: MemberRole.COORDENADOR,
    });
    authorId = author.id;
    moderatorId = moderator.id;
  });

  it('creates a proposal with initial version', async () => {
    const author = await membersService.findById(authorId);
    const proposal = await proposalsService.createProposal(author!, {
      title: 'Proposta Inicial',
      description: 'Detalhes da proposta',
      content: 'Conteúdo base',
    });
    expect(proposal.versions).toHaveLength(1);
    expect(proposal.versions[0].label).toBe('initial');
  });

  it('merges a pull request and records a new version', async () => {
    const author = await membersService.findById(authorId);
    const proposal = await proposalsService.createProposal(author!, {
      title: 'Proposta com PR',
      description: 'Versão base',
      content: 'Base 1',
    });
    const pr = await proposalsService.createPullRequest(
      proposal.id,
      {
        title: 'Atualização',
        description: 'Melhoria de texto',
        content: 'Base 1 melhorada',
      },
      author!,
    );
    const moderator = await membersService.findById(moderatorId);
    const merged = await proposalsService.mergePullRequest(proposal.id, pr.id, moderator!);
    const updatedProposal = await proposalsService.findOne(proposal.id);
    expect(merged.content).toContain('melhorada');
    expect(updatedProposal.versions).toHaveLength(2);
    expect(
      updatedProposal.pullRequests.find((candidate) => candidate.id === pr.id)?.status,
    ).toBe('merged');
  });
});
