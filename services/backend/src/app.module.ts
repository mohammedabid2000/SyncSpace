import { Module } from '@nestjs/common';
import { ConfigModule } '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
        ConfigModule.froRoot({isGlobal.true, }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
