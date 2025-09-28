import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EnvService } from './env/env.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'node:path';
import * as fs from 'node:fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const envService = app.get(EnvService);

  app.use(cookieParser());
  app.enableCors({
    origin: envService.get('CLIENT_URL'),
    credentials: true,
  });

  const uploadsDir = path.join(process.cwd(), 'uploads');
  const avatarsDir = path.join(uploadsDir, 'avatars');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }

  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  await app.listen(envService.get('PORT') ?? 5000);
}
bootstrap();
