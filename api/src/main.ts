import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  app.use(cookieParser());
  app.enableCors({
    origin: envService.get('CLIENT_URL'),
    credentials: true,
  });

  await app.listen(envService.get('PORT') ?? 5000);
}
bootstrap();
