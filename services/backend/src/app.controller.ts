import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
    
  @Get('test')
  getbackendhealth() :string
        return "The Back end Already healthy";
  @Get()
  getHello(): string {
    return this.appService.getHello();
  } 
}

