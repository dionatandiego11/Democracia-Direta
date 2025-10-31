import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditLoggerMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      void this.auditService.record({
        actor: req.user ? (req.user as any).id : null,
        action: `${req.method} ${req.originalUrl}`,
        metadata: {
          status: res.statusCode,
          duration,
        },
      });
    });
    next();
  }
}
