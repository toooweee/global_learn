import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterRequestStatus } from '../register-requests/register-request.schema';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegisterConfirmation(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Заявка на регистрацию',
      template: 'register-confirmation',
      context: {
        email: to,
      },
    });
  }

  async sendStatusUpdateEmail(to: string, status: RegisterRequestStatus, completeRegistrationUrl?: string) {
    if (status == RegisterRequestStatus.APPROVED) {
      await this.mailerService.sendMail({
        to,
        subject: 'Ваша заявка на регистрацию одобрена!',
        template: 'approved-email',
        context: {
          email: to,
          completeRegistrationUrl: completeRegistrationUrl || 'https://globallearn.example.com/complete-registration', // Замените на реальный URL
        },
      });
    } else if (status == RegisterRequestStatus.REJECTED) {
      await this.mailerService.sendMail({
        to,
        subject: 'Ваша заявка на регистрацию отклонена',
        template: 'rejected-email',
        context: {
          email: to,
        },
      });
    }
  }
}
