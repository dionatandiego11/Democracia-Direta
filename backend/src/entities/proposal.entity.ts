import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Directory } from './directory.entity';
import { ProposalVersion } from './proposal-version.entity';
import { Issue } from './issue.entity';
import { PullRequest } from './pull-request.entity';

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => Member, (member) => member.proposals, { eager: true })
  author!: Member;

  @ManyToOne(() => Directory, (directory) => directory.proposals, { nullable: true, eager: true })
  directory?: Directory | null;

  @OneToMany(() => ProposalVersion, (version) => version.proposal, {
    cascade: true,
    eager: true,
  })
  versions!: ProposalVersion[];

  @OneToMany(() => Issue, (issue) => issue.proposal, { cascade: true })
  issues!: Issue[];

  @OneToMany(() => PullRequest, (pullRequest) => pullRequest.targetProposal, { cascade: true })
  pullRequests!: PullRequest[];

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
