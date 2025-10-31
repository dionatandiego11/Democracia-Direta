import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';
import { Proposal } from './proposal.entity';

@Entity('directories')
export class Directory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Member, (member) => member.directories)
  members!: Member[];

  @OneToMany(() => Proposal, (proposal) => proposal.directory)
  proposals!: Proposal[];
}
