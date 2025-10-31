import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member } from '../entities/member.entity';
import { MemberRole } from '../common/enums/member-role.enum';

export interface CreateMemberInput {
  name: string;
  email: string;
  partyId: string;
  ecpfId?: string | null;
  password: string;
  role?: MemberRole;
}

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(input: CreateMemberInput) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const member = this.membersRepository.create({
      name: input.name,
      email: input.email,
      partyId: input.partyId,
      ecpfId: input.ecpfId ?? null,
      passwordHash,
      role: input.role ?? MemberRole.FILIADO,
    });
    return this.membersRepository.save(member);
  }

  findByPartyId(partyId: string) {
    return this.membersRepository.findOne({ where: { partyId } });
  }

  findByPartyIdWithPassword(partyId: string) {
    return this.membersRepository.findOne({
      where: { partyId },
      select: ['id', 'passwordHash', 'partyId'],
    });
  }

  findByEcpfId(ecpfId: string) {
    return this.membersRepository.findOne({ where: { ecpfId } });
  }

  findById(id: string) {
    return this.membersRepository.findOne({ where: { id } });
  }

  async validatePassword(member: { passwordHash: string }, password: string) {
    return bcrypt.compare(password, member.passwordHash);
  }
}
