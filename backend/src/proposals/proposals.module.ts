import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from '../entities/proposal.entity';
import { ProposalVersion } from '../entities/proposal-version.entity';
import { PullRequest } from '../entities/pull-request.entity';
import { Issue } from '../entities/issue.entity';
import { Directory } from '../entities/directory.entity';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { MembersModule } from '../members/members.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal, ProposalVersion, PullRequest, Issue, Directory]),
    MembersModule,
    AuditModule,
  ],
  providers: [ProposalsService],
  controllers: [ProposalsController],
  exports: [ProposalsService],
})
export class ProposalsModule {}
