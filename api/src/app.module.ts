import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { ProvidersModule } from '@providers/providers.module';
import { TrpcModule } from '@trpc/trpc.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { RegisterRequestsModule } from './register-requests/register-requests.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    ProvidersModule,
    TrpcModule,
    AuthModule,
    TokensModule,
    RegisterRequestsModule,
    CompaniesModule,
  ],
})
export class AppModule {}
