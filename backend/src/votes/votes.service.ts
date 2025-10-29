import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoteSession } from '../entities/vote-session.entity';
import { Vote } from '../entities/vote.entity';
import { Proposal } from '../entities/proposal.entity';
import { Member } from '../entities/member.entity';
import { MemberRole } from '../common/enums/member-role.enum';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VoteSession)
    private readonly voteSessionRepository: Repository<VoteSession>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
    private readonly auditService: AuditService,
  ) {}

  async createSession(member: Member, dto: CreateVoteSessionDto) {
    this.ensureModerator(member);
    const proposal = await this.proposalRepository.findOne({ where: { id: dto.proposalId } });
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    const session = this.voteSessionRepository.create({
      proposal,
      weights: dto.weights,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      status: 'draft',
    });
    session.blockchainAnchor = dto.blockchainAnchor ?? null;
    const savedSession = await this.voteSessionRepository.save(session);
    await this.auditService.record({
      actor: member.id,
      action: 'vote.session.created',
      metadata: { sessionId: savedSession.id, blockchainAnchor: dto.blockchainAnchor },
    });
    return savedSession;
  }

  async openSession(member: Member, sessionId: string) {
    this.ensureModerator(member);
    const session = await this.getSession(sessionId);
    session.status = 'open';
    await this.voteSessionRepository.save(session);
    await this.auditService.record({
      actor: member.id,
      action: 'vote.session.opened',
      metadata: { sessionId: session.id },
    });
    return session;
  }

  async closeSession(member: Member, sessionId: string) {
    this.ensureModerator(member);
    const session = await this.getSession(sessionId);
    session.status = 'closed';
    await this.voteSessionRepository.save(session);
    await this.auditService.record({
      actor: member.id,
      action: 'vote.session.closed',
      metadata: { sessionId: session.id },
    });
    return session;
  }

  async castVote(member: Member, sessionId: string, dto: CastVoteDto) {
    const session = await this.getSession(sessionId);
    if (session.status !== 'open') {
      throw new ForbiddenException('Voting session is not open');
    }
    const existing = await this.voteRepository.findOne({
      where: {
        session: { id: sessionId },
        member: { id: member.id },
      },
      relations: ['member', 'session'],
    });
    if (existing) {
      existing.choice = dto.choice;
      existing.weight = this.resolveWeight(session, member);
      await this.voteRepository.save(existing);
      return existing;
    }
    const vote = this.voteRepository.create({
      session,
      member,
      choice: dto.choice,
      weight: this.resolveWeight(session, member),
    });
    const savedVote = await this.voteRepository.save(vote);
    await this.auditService.record({
      actor: member.id,
      action: 'vote.session.cast',
      metadata: { sessionId: session.id, choice: dto.choice },
    });
    return savedVote;
  }

  async getReport(sessionId: string) {
    const session = await this.voteSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['votes', 'votes.member', 'proposal'],
    });
    if (!session) {
      throw new NotFoundException('Voting session not found');
    }
    const totals = session.votes.reduce(
      (acc, vote) => {
        acc.totalWeight += vote.weight;
        acc.choices[vote.choice] = (acc.choices[vote.choice] ?? 0) + vote.weight;
        return acc;
      },
      { totalWeight: 0, choices: {} as Record<string, number> },
    );
    return {
      sessionId: session.id,
      proposalId: session.proposal.id,
      totals,
      weights: session.weights,
      votes: session.votes.map((vote) => ({
        memberId: vote.member.id,
        choice: vote.choice,
        weight: vote.weight,
      })),
    };
  }

  async exportReport(sessionId: string, format: 'json' | 'csv' = 'json') {
    const report = await this.getReport(sessionId);
    if (format === 'csv') {
      const header = 'memberId,choice,weight';
      const lines = report.votes.map((vote) => `${vote.memberId},${vote.choice},${vote.weight}`);
      return [header, ...lines].join('\n');
    }
    return report;
  }

  private async getSession(sessionId: string) {
    const session = await this.voteSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['proposal'],
    });
    if (!session) {
      throw new NotFoundException('Voting session not found');
    }
    return session;
  }

  private resolveWeight(session: VoteSession, member: Member) {
    return session.weights[member.role] ?? 1;
  }

  private ensureModerator(member: Member) {
    if (![MemberRole.COORDENADOR, MemberRole.DIRETORIO, MemberRole.EXECUTIVO].includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}
