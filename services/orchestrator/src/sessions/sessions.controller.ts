import { Controller, Get, Param, Post, Delete, HttpCode } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  list() {
    return this.sessionsService.list();
  }

  @Post()
  create() {
    return this.sessionsService.create();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.sessionsService.get(Number(id));
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): void {
    this.sessionsService.delete(Number(id));
  }
}
