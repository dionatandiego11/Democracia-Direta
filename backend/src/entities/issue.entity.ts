import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Proposal } from './proposal.entity';
import { Member } from './member.entity';

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => Proposal, (proposal) => proposal.issues)
  proposal!: Proposal;

  @ManyToOne(() => Member, { eager: true })
  author!: Member;

  @Column({ nullable: true })
  suggestionVersionId?: string | null;

  @Column({ default: 'open' })
  status!: 'open' | 'closed';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
