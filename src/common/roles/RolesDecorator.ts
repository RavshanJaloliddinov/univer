import { SetMetadata } from '@nestjs/common';
import { AdminRoles } from 'src/common/database/Enum';

export const ROLES_KEY = 'roles';
export const RolesDecorator = (...roles: AdminRoles[]) => {
    return SetMetadata(ROLES_KEY, roles);
};