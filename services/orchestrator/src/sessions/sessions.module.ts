import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { SessionsController } from './sessions.controller.js';
import { NekoModule } from '../neko/neko.module.js';
import { OrchestratorTokenGuard } from './orchestrator-token.guard.js';

@Module({
  providers: [SessionsService, OrchestratorTokenGuard],
  controllers: [SessionsController],
  imports: [NekoModule],
})
export class SessionsModule {}
