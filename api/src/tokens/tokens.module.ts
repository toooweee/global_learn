import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: process.env.JWT_AT_EXPIRES as string,
      },
    }),
  ],
  providers: [TokensService],
})
export class TokensModule {}
