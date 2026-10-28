import { Controller, Post, Delete, Param } from '@nestjs/common';
import { NekoService } from './neko.service.js';

@Controller('neko')
export class NekoController {
  constructor(private readonly nekoService: NekoService) {}
  @Post('local')
  async startLocal(): Promise<{ id: string }> {
    const id = await this.nekoService.startLocal();
    return { id };
  }
  @Delete('local/:id')
  async stopLocal(@Param('id') id: string): Promise<void> {
    await this.nekoService.stopLocal(id);
  }
}
