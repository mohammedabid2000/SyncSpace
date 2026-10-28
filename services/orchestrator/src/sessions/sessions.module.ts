import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { SessionsController } from './sessions.controller.js';
import { NekoModule } from '../neko/neko.module.js';

@Module({
  providers: [SessionsService],
  controllers: [SessionsController],
  imports: [NekoModule],
})
export class SessionsModule {}
