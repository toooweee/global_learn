import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EnvService } from './env/env.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const envService = app.get(EnvService);

  app.use(cookieParser());
  app.enableCors({
    origin: envService.get('CLIENT_URL'),
    credentials: true,
  });

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(envService.get('PORT') ?? 5000);
}
bootstrap();
