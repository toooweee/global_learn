import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsRouter } from './directions.router';

@Module({
  providers: [DirectionsService, DirectionsRouter],
})
export class DirectionsModule {}
