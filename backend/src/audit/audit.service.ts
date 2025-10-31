import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

export interface AuditRecord {
  actor: string | null;
  action: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async record(record: AuditRecord) {
    const log = this.auditRepository.create({
      actorId: record.actor,
      action: record.action,
      metadata: record.metadata ?? {},
    });
    await this.auditRepository.save(log);
  }
}
