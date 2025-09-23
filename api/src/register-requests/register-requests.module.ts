import { Module } from '@nestjs/common';
import { RegisterRequestsService } from './register-requests.service';
import { RegisterRequestsRouter } from './register-requests.router';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [EmailModule],
  providers: [RegisterRequestsService, RegisterRequestsRouter],
})
export class RegisterRequestsModule {}
