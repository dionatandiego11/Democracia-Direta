import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proposal } from './proposal.entity';
import { ProposalVersion } from './proposal-version.entity';
import { Member } from './member.entity';

@Entity('pull_requests')
export class PullRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => Proposal, (proposal) => proposal.pullRequests)
  targetProposal!: Proposal;

  @ManyToOne(() => ProposalVersion, { eager: true, cascade: true })
  proposedVersion!: ProposalVersion;

  @ManyToOne(() => Member, (member) => member.pullRequests, { eager: true })
  author!: Member;

  @Column({ default: 'open' })
  status!: 'open' | 'merged' | 'rejected';

  @OneToMany(() => ProposalVersion, () => undefined, { cascade: true })
  reviewNotes!: ProposalVersion[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
