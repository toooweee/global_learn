import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { AccessMiddleware } from './middleware';

@Global()
@Module({
  imports: [UsersModule, TokensModule],
  providers: [AuthService, AuthRouter, AccessMiddleware],
  exports: [AccessMiddleware],
})
export class AuthModule {}
