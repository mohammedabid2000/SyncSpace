import { Module } from '@nestjs/common';
import { NekoService } from './neko.service.js';
import { DockerModule } from '../docker/docker.module.js';
import { NekoController } from './neko.controller.js';

@Module({
  imports: [DockerModule],
  providers: [NekoService],
  controllers: [NekoController],
  exports: [NekoService],
})
export class NekoModule {}
