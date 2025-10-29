import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VoteSession } from './vote-session.entity';
import { Member } from './member.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => VoteSession, (session) => session.votes, { onDelete: 'CASCADE' })
  session!: VoteSession;

  @ManyToOne(() => Member, (member) => member.votes, { eager: true })
  member!: Member;

  @Column({ type: 'float' })
  weight!: number;

  @Column({ type: 'varchar' })
  choice!: 'yes' | 'no' | 'abstain';

  @CreateDateColumn()
  createdAt!: Date;
}
