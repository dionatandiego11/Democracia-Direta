import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  actorId!: string | null;

  @ManyToOne(() => Member, (member) => member.auditLogs, { nullable: true })
  actor?: Member | null;

  @Column()
  action!: string;

  @Column({ type: 'simple-json', default: '{}' })
  metadata!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
