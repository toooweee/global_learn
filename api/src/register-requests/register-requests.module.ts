import { Module } from '@nestjs/common';
import { RegisterRequestsService } from './register-requests.service';
import { RegisterRequestsRouter } from './register-requests.router';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { RegisterRequestTokenService } from './register-request-tokens.service';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [EmailModule, UsersModule, CompaniesModule],
  providers: [RegisterRequestsService, RegisterRequestsRouter, RegisterRequestTokenService],
})
export class RegisterRequestsModule {}
