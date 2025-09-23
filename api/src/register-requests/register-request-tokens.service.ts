import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { TRPCError } from '@trpc/server';

@Injectable()
export class RegisterRequestTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateToken(registerRequestId: string) {
    const request = await this.prismaService.registerRequest.findUnique({
      where: { id: registerRequestId },
    });
    if (!request) {
      throw new TRPCError({
        message: `Register request with id ${registerRequestId} not found`,
        code: 'NOT_FOUND',
      });
    }

    const existingToken = await this.prismaService.registerRequestToken.findUnique({
      where: { registerRequestId },
    });
    if (existingToken) {
      await this.prismaService.registerRequestToken.delete({
        where: { registerRequestId },
      });
    }

    const token: string = uuidv4();
    const expiresAt = add(new Date(), { days: 7 });

    return this.prismaService.registerRequestToken.create({
      data: {
        token,
        expiresAt,
        registerRequestId,
      },
    });
  }

  async findToken(token: string) {
    return this.prismaService.registerRequestToken.findUnique({
      where: { token },
      include: {
        RegisterRequest: true,
      },
    });
  }

  async validateToken(token: string) {
    const tokenFromDb = await this.findToken(token);

    if (!tokenFromDb) {
      throw new TRPCError({
        message: 'Activation link expires',
        code: 'FORBIDDEN',
      });
    }

    return {
      registerRequestId: tokenFromDb.registerRequestId,
      isValid: new Date() < tokenFromDb.expiresAt,
    };
  }

  async refreshToken(token: string) {
    const tokenFromDb = await this.findToken(token);

    if (!tokenFromDb) {
      throw new TRPCError({
        message: 'Token not found',
        code: 'NOT_FOUND',
      });
    }

    if (tokenFromDb.expiresAt < new Date()) {
      throw new TRPCError({
        message: 'Token has expired',
        code: 'BAD_REQUEST',
      });
    }

    const newToken = uuidv4();
    const expiresAt = add(new Date(), { hours: 24 });

    return this.prismaService.registerRequestToken.update({
      where: {
        token: tokenFromDb.token,
      },
      data: {
        token: newToken,
        expiresAt,
      },
    });
  }
}
