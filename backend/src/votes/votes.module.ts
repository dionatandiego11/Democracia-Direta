import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteSession } from '../entities/vote-session.entity';
import { Vote } from '../entities/vote.entity';
import { Proposal } from '../entities/proposal.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { MembersModule } from '../members/members.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteSession, Vote, Proposal]),
    MembersModule,
    AuditModule,
  ],
  providers: [VotesService],
  controllers: [VotesController],
  exports: [VotesService],
})
export class VotesModule {}
