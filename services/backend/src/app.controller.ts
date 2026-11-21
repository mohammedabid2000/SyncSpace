import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}
    
  @Get('test')
  getbackendhealth() :string {
        return "The Back end Already healthy";
    }

  @Get('health/db')
  async getDbHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  } 
}

