import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proposal } from './proposal.entity';
import { Member } from './member.entity';

@Entity('proposal_versions')
export class ProposalVersion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  label!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ nullable: true })
  parentVersionId?: string | null;

  @ManyToOne(() => Proposal, (proposal) => proposal.versions)
  proposal!: Proposal;

  @ManyToOne(() => Member, { eager: true })
  author!: Member;

  @CreateDateColumn()
  createdAt!: Date;
}
