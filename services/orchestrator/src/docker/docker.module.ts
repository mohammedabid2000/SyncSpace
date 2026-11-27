import { Module } from '@nestjs/common';
import { DockerService } from './docker.service.js';
import { DockerController } from './docker.controller.js';

@Module({
  providers: [DockerService],
  controllers: [DockerController],
  exports: [DockerService],
})
export class DockerModule {}
