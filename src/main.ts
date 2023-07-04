import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { LoggerService } from './logger/logger.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  app.use(cors());
  app.setGlobalPrefix('/api');
  await app.listen(8888);
}
bootstrap();
