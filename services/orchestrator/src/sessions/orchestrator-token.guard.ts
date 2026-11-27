import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class OrchestratorTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = process.env.ORCHESTRATOR_API_TOKEN;
    const received = request.headers['x-orchestrator-token'];

    if (!expected || received !== expected) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
