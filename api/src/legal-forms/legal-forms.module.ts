import { Module } from '@nestjs/common';
import { LegalFormsService } from './legal-forms.service';
import { LegalFormsRouter } from './legal-forms.router';

@Module({
  providers: [LegalFormsService, LegalFormsRouter],
})
export class LegalFormsModule {}
