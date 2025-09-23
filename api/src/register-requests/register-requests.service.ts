import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateRegisterRequestDto,
  RegisterRequestStatus,
  UpdateRegisterRequestStatusDto,
} from './register-request.schema';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { EmailService } from '../email/email.service';

@Injectable()
export class RegisterRequestsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createRegisterRequest(createRegisterRequestDto: CreateRegisterRequestDto) {
    const { email } = createRegisterRequestDto;

    const existingRequest = await this.findOneRegisterRequest({ email });

    if (existingRequest) {
      throw new TRPCError({
        message: `Register request with email ${email} already exists`,
        code: 'CONFLICT',
      });
    }

    const request = await this.prismaService.registerRequest.create({
      data: {
        ...createRegisterRequestDto,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        status: true,
      },
    });

    await this.emailService.sendRegisterConfirmation(email);

    return request;
  }

  async findOneRegisterRequest(where: Prisma.RegisterRequestWhereUniqueInput) {
    return this.prismaService.registerRequest.findUnique({
      where,
    });
  }

  async findAllRegisterRequests() {
    return this.prismaService.registerRequest.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async updateRegisterRequestStatus(updateRegisterRequestDto: UpdateRegisterRequestStatusDto) {
    const updated = await this.prismaService.registerRequest.update({
      where: {
        id: updateRegisterRequestDto.id,
      },
      data: {
        status: updateRegisterRequestDto.status,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    await this.emailService.sendStatusUpdateEmail(updated.email, updated.status as RegisterRequestStatus);

    return updated;
  }
}
