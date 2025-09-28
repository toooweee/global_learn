import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRouter } from './users.router';
import { UsersController } from './users.controller';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TokensModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRouter],
  exports: [UsersService],
})
export class UsersModule {}
