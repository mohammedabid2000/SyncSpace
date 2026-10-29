import { Module } from '@nestjs/common';
import { NekoService } from './neko.service.js';
import { DockerModule } from '../docker/docker.module.js';

@Module({
  imports: [DockerModule],
  providers: [NekoService],
  exports: [NekoService],
})
export class NekoModule {}
