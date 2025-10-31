import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberRole } from '../common/enums/member-role.enum';
import { Directory } from './directory.entity';
import { Proposal } from './proposal.entity';
import { PullRequest } from './pull-request.entity';
import { Vote } from './vote.entity';
import { AuditLog } from './audit-log.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  partyId!: string;

  @Column({ nullable: true, unique: true })
  ecpfId?: string | null;

  @Column({ select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.FILIADO })
  role!: MemberRole;

  @ManyToMany(() => Directory, (directory) => directory.members, { cascade: true })
  @JoinTable({ name: 'member_directories' })
  directories!: Directory[];

  @OneToMany(() => Proposal, (proposal) => proposal.author)
  proposals!: Proposal[];

  @OneToMany(() => PullRequest, (pr) => pr.author)
  pullRequests!: PullRequest[];

  @OneToMany(() => Vote, (vote) => vote.member)
  votes!: Vote[];

  @OneToMany(() => AuditLog, (log) => log.actor)
  auditLogs!: AuditLog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
