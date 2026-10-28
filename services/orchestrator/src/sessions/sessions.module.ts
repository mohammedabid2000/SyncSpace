import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { SessionsController } from './sessions.controller.js';

@Module({
  providers: [SessionsService],
  controllers: [SessionsController]
})
export class SessionsModule {}
