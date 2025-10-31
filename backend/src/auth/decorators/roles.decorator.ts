import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '../../common/enums/member-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);
