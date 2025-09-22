import { Injectable } from '@nestjs/common';
import { LoginDto } from './auth.schema';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { TRPCError } from '@trpc/server';
import { TokensService } from '../tokens/tokens.service';
import { JwtPayload } from '../tokens/types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.usersService.findOne({ email });

      await this.usersService.comparePassword(user.password, password);

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = await this.tokensService.generateTokens(payload);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.token,
      };
    } catch (e) {
      if (e instanceof TRPCError && e.code === 'NOT_FOUND') {
        throw new TRPCError({
          message: 'Invalid credentials',
          code: 'UNAUTHORIZED',
        });
      }

      if (e instanceof TRPCError && e.code === 'UNAUTHORIZED') {
        throw new TRPCError({
          message: 'Invalid credentials',
          code: 'UNAUTHORIZED',
        });
      }

      console.log(e);

      throw new TRPCError({
        message: 'Something went wrong',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async refresh() {}

  async logout() {}
}
