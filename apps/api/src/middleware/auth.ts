import { Request, Response, NextFunction } from 'express';

// Placeholder para autenticação JWT
// Em produção, usar jsonwebtoken e validar tokens reais

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || token === 'dev-token') {
    // Modo desenvolvimento - permite acesso
    req.user = {
      id: 'demo-user-id',
      email: 'demo@partido.br',
      name: 'Demo User'
    };
    return next();
  }

  // TODO: Implementar validação JWT real
  // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  // req.user = decoded;
  
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }
    
    // TODO: Verificar role do usuário no banco
    // const membership = await prisma.membership.findFirst({
    //   where: { userId: req.user.id, role: { in: roles } }
    // });
    
    next();
  };
}