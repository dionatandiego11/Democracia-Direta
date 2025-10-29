import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { ProposalsModule } from './proposals/proposals.module';
import { VotesModule } from './votes/votes.module';
import { AuditModule } from './audit/audit.module';
import { AuditLoggerMiddleware } from './common/middleware/audit-logger.middleware';
import { Member } from './entities/member.entity';
import { Directory } from './entities/directory.entity';
import { Proposal } from './entities/proposal.entity';
import { ProposalVersion } from './entities/proposal-version.entity';
import { Issue } from './entities/issue.entity';
import { PullRequest } from './entities/pull-request.entity';
import { VoteSession } from './entities/vote-session.entity';
import { Vote } from './entities/vote.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'democracia_direta',
        entities: [Member, Directory, Proposal, ProposalVersion, Issue, PullRequest, VoteSession, Vote, AuditLog],
        synchronize: true,
        logging: process.env.TYPEORM_LOGGING === 'true',
      }),
    }),
    AuthModule,
    MembersModule,
    ProposalsModule,
    VotesModule,
    AuditModule,
  ],
  providers: [AuditLoggerMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditLoggerMiddleware).forRoutes('*');
  }
}
