import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
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
  get(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.get(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sessionsService.delete(id);
  }
}
