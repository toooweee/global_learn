import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRouter } from '@auth/auth.router';

@Module({
  providers: [AuthService, AuthRouter],
})
export class AuthModule {}
