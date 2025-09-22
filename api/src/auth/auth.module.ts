import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  providers: [AuthService, AuthRouter],
  imports: [UsersModule, TokensModule],
})
export class AuthModule {}
