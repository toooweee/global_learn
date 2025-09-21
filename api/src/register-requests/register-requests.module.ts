import { Module } from '@nestjs/common';
import { RegisterRequestsService } from './register-requests.service';
import { RegisterRequestsRouter } from './register-requests.router';

@Module({
  providers: [RegisterRequestsService, RegisterRequestsRouter],
})
export class RegisterRequestsModule {}
