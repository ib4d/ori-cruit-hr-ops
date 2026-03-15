import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the current organization context from the JWT payload.
 * Usage: @CurrentOrg() org: { id: string; role: string }
 */
export const CurrentOrg = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.org ?? null;
  },
);

/**
 * Extracts the current user from the JWT payload.
 * Usage: @CurrentUser() user: { id: string; email: string }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
