import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EnvService } from '../env/env.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(envService: EnvService) {
    super({
      datasources: {
        db: {
          url: envService.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
