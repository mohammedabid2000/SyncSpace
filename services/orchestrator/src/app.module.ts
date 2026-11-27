import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { DockerModule } from './docker/docker.module.js';
import { NekoModule } from './neko/neko.module.js';

@Module({
  imports: [SessionsModule, DockerModule, NekoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
