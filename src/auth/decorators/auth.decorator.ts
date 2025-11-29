import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/generated/enums';
import { Roles } from '@src/auth/decorators/roles.decorator';
import { AuthGuard } from '@src/auth/guards/auth.guard';
import { RolesGuard } from '@src/auth/guards/roles.guard';

export function Authorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
}
