import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { ProvidersModule } from '@providers/providers.module';
import { TrpcModule } from './trpc/trpc.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { RegisterRequestsModule } from './register-requests/register-requests.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';
import { EnvSchema } from './env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => EnvSchema.parse(env),
    }),
    PrismaModule,
    UsersModule,
    ProvidersModule,
    TrpcModule,
    AuthModule,
    TokensModule,
    RegisterRequestsModule,
    CompaniesModule,
    EnvModule,
  ],
})
export class AppModule {}
