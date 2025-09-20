import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from '@users/users.module';
import { ProvidersModule } from '@providers/providers.module';
import { TrpcModule } from './trpc/trpc.module';

@Module({
  imports: [PrismaModule, UsersModule, ProvidersModule, TrpcModule],
})
export class AppModule {}
