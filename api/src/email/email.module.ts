import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import * as path from 'node:path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService) => {
        return {
          transport: {
            host: envService.get('SMTP_HOST') as string,
            port: Number(envService.get('SMTP_PORT')),
            secure: false,
            auth: {
              user: envService.get('SMTP_USER') as string,
              pass: envService.get('SMTP_PASSWORD') as string,
            },
          },
          defaults: {
            from: `"GlobalLearn" <${envService.get('SMTP_USER')}>`,
          },
          template: {
            dir: path.join(process.cwd(), 'dist/templates/templates'),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [EnvService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
