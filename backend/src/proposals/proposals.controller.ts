import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ForkProposalDto } from './dto/fork-proposal.dto';
import { CreatePullRequestDto } from './dto/create-pull-request.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { CurrentMember } from '../auth/decorators/current-member.decorator';
import { Member } from '../entities/member.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Public()
  @Get()
  list() {
    return this.proposalsService.findAll();
  }

  @Public()
  @Get(':id')
  get(@Param('id') id: string) {
    return this.proposalsService.findOne(id);
  }

  @Post()
  create(@CurrentMember() member: Member, @Body() dto: CreateProposalDto) {
    return this.proposalsService.createProposal(member, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentMember() member: Member,
    @Body() dto: UpdateProposalDto,
  ) {
    return this.proposalsService.updateProposal(id, dto, member);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentMember() member: Member) {
    return this.proposalsService.deleteProposal(id, member);
  }

  @Post(':id/fork')
  fork(@Param('id') id: string, @CurrentMember() member: Member, @Body() dto: ForkProposalDto) {
    return this.proposalsService.forkProposal(id, dto, member);
  }

  @Post(':id/pull-requests')
  createPullRequest(
    @Param('id') id: string,
    @CurrentMember() member: Member,
    @Body() dto: CreatePullRequestDto,
  ) {
    return this.proposalsService.createPullRequest(id, dto, member);
  }

  @Get(':id/pull-requests')
  listPullRequests(@Param('id') id: string) {
    return this.proposalsService.listPullRequests(id);
  }

  @Post(':id/pull-requests/:prId/merge')
  mergePullRequest(
    @Param('id') id: string,
    @Param('prId') prId: string,
    @CurrentMember() member: Member,
  ) {
    return this.proposalsService.mergePullRequest(id, prId, member);
  }

  @Post(':id/issues')
  createIssue(
    @Param('id') id: string,
    @CurrentMember() member: Member,
    @Body() dto: CreateIssueDto,
  ) {
    return this.proposalsService.createIssue(id, dto, member);
  }

  @Get(':id/issues')
  listIssues(@Param('id') id: string) {
    return this.proposalsService.listIssues(id);
  }
}
