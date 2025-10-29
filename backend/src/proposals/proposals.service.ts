import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from '../entities/proposal.entity';
import { ProposalVersion } from '../entities/proposal-version.entity';
import { PullRequest } from '../entities/pull-request.entity';
import { Issue } from '../entities/issue.entity';
import { Directory } from '../entities/directory.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ForkProposalDto } from './dto/fork-proposal.dto';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { Member } from '../entities/member.entity';
import { MemberRole } from '../common/enums/member-role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalsRepository: Repository<Proposal>,
    @InjectRepository(ProposalVersion)
    private readonly versionsRepository: Repository<ProposalVersion>,
    @InjectRepository(PullRequest)
    private readonly pullRequestRepository: Repository<PullRequest>,
    @InjectRepository(Issue)
    private readonly issuesRepository: Repository<Issue>,
    @InjectRepository(Directory)
    private readonly directoryRepository: Repository<Directory>,
    private readonly auditService: AuditService,
  ) {}

  async createProposal(author: Member, dto: CreateProposalDto) {
    const directory = dto.directoryId
      ? await this.directoryRepository.findOne({ where: { id: dto.directoryId } })
      : undefined;
    if (dto.directoryId && !directory) {
      throw new NotFoundException('Directory not found');
    }
    const proposal = this.proposalsRepository.create({
      title: dto.title,
      description: dto.description,
      author,
      directory,
    });
    const savedProposal = await this.proposalsRepository.save(proposal);
    const version = this.versionsRepository.create({
      label: 'initial',
      content: dto.content,
      author,
      proposal: savedProposal,
    });
    await this.versionsRepository.save(version);
    savedProposal.versions = [version];
    await this.auditService.record({
      actor: author.id,
      action: 'proposal.created',
      metadata: { proposalId: savedProposal.id },
    });
    return savedProposal;
  }

  findAll() {
    return this.proposalsRepository.find({
      relations: [
        'versions',
        'issues',
        'issues.author',
        'pullRequests',
        'pullRequests.proposedVersion',
        'pullRequests.author',
      ],
    });
  }

  async findOne(id: string) {
    const proposal = await this.proposalsRepository.findOne({
      where: { id },
      relations: [
        'versions',
        'issues',
        'issues.author',
        'pullRequests',
        'pullRequests.proposedVersion',
        'pullRequests.author',
      ],
    });
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    return proposal;
  }

  async updateProposal(id: string, dto: UpdateProposalDto, member: Member) {
    const proposal = await this.findOne(id);
    if (member.role === MemberRole.FILIADO && proposal.author.id !== member.id) {
      throw new ForbiddenException('Only author or moderators can edit');
    }
    Object.assign(proposal, dto);
    await this.proposalsRepository.save(proposal);
    await this.auditService.record({
      actor: member.id,
      action: 'proposal.updated',
      metadata: { proposalId: proposal.id },
    });
    return proposal;
  }

  async deleteProposal(id: string, member: Member) {
    const proposal = await this.findOne(id);
    if (![MemberRole.DIRETORIO, MemberRole.EXECUTIVO].includes(member.role)) {
      if (proposal.author.id !== member.id) {
        throw new ForbiddenException('Not allowed to archive proposal');
      }
    }
    proposal.isActive = false;
    await this.proposalsRepository.save(proposal);
    await this.auditService.record({
      actor: member.id,
      action: 'proposal.archived',
      metadata: { proposalId: proposal.id },
    });
    return proposal;
  }

  async forkProposal(id: string, dto: ForkProposalDto, member: Member) {
    const original = await this.findOne(id);
    const latestVersion = original.versions[original.versions.length - 1];
    if (!latestVersion) {
      throw new NotFoundException('Proposal has no versions to fork');
    }
    const forked = this.proposalsRepository.create({
      title: `${original.title} (fork)`,
      description: dto.description ?? original.description,
      author: member,
      directory: original.directory,
    });
    const savedFork = await this.proposalsRepository.save(forked);
    const forkVersion = this.versionsRepository.create({
      label: dto.label ?? `forked-from-${latestVersion.id}`,
      content: latestVersion.content,
      author: member,
      proposal: savedFork,
      parentVersionId: latestVersion.id,
    });
    await this.versionsRepository.save(forkVersion);
    savedFork.versions = [forkVersion];
    await this.auditService.record({
      actor: member.id,
      action: 'proposal.forked',
      metadata: { proposalId: savedFork.id, from: original.id },
    });
    return savedFork;
  }

  async createPullRequest(proposalId: string, dto: CreatePullRequestDto, member: Member) {
    const proposal = await this.findOne(proposalId);
    const baseVersion = dto.baseVersionId
      ? await this.versionsRepository.findOne({ where: { id: dto.baseVersionId } })
      : proposal.versions[proposal.versions.length - 1];
    if (!baseVersion) {
      throw new NotFoundException('Base version not found');
    }
    const proposedVersion = this.versionsRepository.create({
      label: `${baseVersion.label}-pr`,
      content: dto.content,
      author: member,
      proposal,
      parentVersionId: baseVersion.id,
    });
    await this.versionsRepository.save(proposedVersion);
    const pr = this.pullRequestRepository.create({
      title: dto.title,
      description: dto.description,
      targetProposal: proposal,
      proposedVersion,
      author: member,
      status: 'open',
    });
    await this.pullRequestRepository.save(pr);
    await this.auditService.record({
      actor: member.id,
      action: 'proposal.pull_request.created',
      metadata: { proposalId: proposal.id, pullRequestId: pr.id },
    });
    return pr;
  }

  async listPullRequests(proposalId: string) {
    const proposal = await this.findOne(proposalId);
    return proposal.pullRequests;
  }

  async mergePullRequest(proposalId: string, prId: string, member: Member) {
    const proposal = await this.findOne(proposalId);
    const pullRequest = proposal.pullRequests.find((pr) => pr.id === prId);
    if (!pullRequest) {
      throw new NotFoundException('Pull request not found');
    }
    if (![MemberRole.COORDENADOR, MemberRole.DIRETORIO, MemberRole.EXECUTIVO].includes(member.role)) {
      if (proposal.author.id !== member.id) {
        throw new ForbiddenException('Insufficient permissions to merge pull request');
      }
    }
    pullRequest.status = 'merged';
    await this.pullRequestRepository.save(pullRequest);
    const mergedVersion = this.versionsRepository.create({
      label: `merge-${pullRequest.proposedVersion.id}`,
      content: pullRequest.proposedVersion.content,
      author: pullRequest.proposedVersion.author,
      proposal,
      parentVersionId: pullRequest.proposedVersion.parentVersionId ?? undefined,
    });
    await this.versionsRepository.save(mergedVersion);
    await this.auditService.record({
      actor: member.id,
      action: 'proposal.pull_request.merged',
      metadata: { proposalId: proposal.id, pullRequestId: pullRequest.id },
    });
    return mergedVersion;
  }

  async createIssue(proposalId: string, dto: CreateIssueDto, member: Member) {
    const proposal = await this.findOne(proposalId);
    const issue = this.issuesRepository.create({
      title: dto.title,
      description: dto.description,
      proposal,
      author: member,
      status: 'open',
    });
    const savedIssue = await this.issuesRepository.save(issue);
    if (dto.suggestedContent) {
      const suggestion = this.versionsRepository.create({
        label: `issue-${savedIssue.id}-suggestion`,
        content: dto.suggestedContent,
        author: member,
        proposal,
      });
      const savedSuggestion = await this.versionsRepository.save(suggestion);
      savedIssue.suggestionVersionId = savedSuggestion.id;
      await this.issuesRepository.save(savedIssue);
    }
    await this.auditService.record({
      actor: member.id,
      action: 'proposal.issue.created',
      metadata: { proposalId: proposal.id, issueId: savedIssue.id },
    });
    return savedIssue;
  }

  async listIssues(proposalId: string) {
    const proposal = await this.findOne(proposalId);
    return proposal.issues;
  }
}
