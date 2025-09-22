import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { EnvService } from '../env/env.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    const { token } = await this.saveRefreshToken(payload.sub);

    return {
      accessToken,
      token,
    };
  }

  async saveRefreshToken(userId: string) {
    const token = uuidv4();

    return this.prismaService.token.create({
      data: {
        token,
        userId,
        expiresAt: add(new Date(), { days: this.getRefreshTokenExpires() }),
      },
      select: {
        token: true,
      },
    });
  }

  async findRefreshToken(token: string) {
    return this.prismaService.token.findUnique({
      where: {
        token,
      },
    });
  }

  async deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({
      where: {
        token,
      },
    });
  }

  private getRefreshTokenExpires() {
    return parseInt(this.envService.get('JWT_RT_EXPIRES')!);
  }
}
