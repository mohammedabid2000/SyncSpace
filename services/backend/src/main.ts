import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from './@nestjs/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform : true,
    }),
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
await bootstrap();
