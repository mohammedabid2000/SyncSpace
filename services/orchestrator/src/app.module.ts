import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { DockerModule } from './docker/docker.module.js';

@Module({
  imports: [SessionsModule, DockerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
