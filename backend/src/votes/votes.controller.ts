import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
import { CurrentMember } from '../auth/decorators/current-member.decorator';
import { Member } from '../entities/member.entity';

@Controller('votes/sessions')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@CurrentMember() member: Member, @Body() dto: CreateVoteSessionDto) {
    return this.votesService.createSession(member, dto);
  }

  @Post(':id/open')
  open(@Param('id') id: string, @CurrentMember() member: Member) {
    return this.votesService.openSession(member, id);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @CurrentMember() member: Member) {
    return this.votesService.closeSession(member, id);
  }

  @Post(':id/votes')
  vote(
    @Param('id') id: string,
    @CurrentMember() member: Member,
    @Body() dto: CastVoteDto,
  ) {
    return this.votesService.castVote(member, id, dto);
  }

  @Get(':id/report')
  report(@Param('id') id: string, @Query('format') format: 'json' | 'csv' = 'json') {
    return this.votesService.exportReport(id, format);
  }
}
