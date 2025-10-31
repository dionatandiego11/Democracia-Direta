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
import { Vote } from './vote.entity';

@Entity('vote_sessions')
export class VoteSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Proposal, { eager: true })
  proposal!: Proposal;

  @Column({ type: 'simple-json', default: '{}' })
  weights!: Record<string, number>;

  @Column({ type: 'timestamp with time zone' })
  startsAt!: Date;

  @Column({ type: 'timestamp with time zone' })
  endsAt!: Date;

  @Column({ nullable: true })
  blockchainAnchor?: string | null;

  @Column({ default: 'draft' })
  status!: 'draft' | 'open' | 'closed' | 'archived';

  @OneToMany(() => Vote, (vote) => vote.session, { cascade: true })
  votes!: Vote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
