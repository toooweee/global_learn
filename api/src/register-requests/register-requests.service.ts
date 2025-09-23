import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CompleteRegistrationDto,
  CreateRegisterRequestDto,
  RegisterRequestStatus,
  UpdateRegisterRequestStatusDto,
} from './register-request.schema';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { EmailService } from '../email/email.service';
import { RegisterRequestTokenService } from './register-request-tokens.service';
import { EnvService } from '../env/env.service';
import { UsersService } from '../users/users.service';
import { Role } from '../users/user.schema';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class RegisterRequestsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly registerRequestTokenService: RegisterRequestTokenService,
    private readonly envService: EnvService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(createRegisterRequestDto: CreateRegisterRequestDto) {
    const { email } = createRegisterRequestDto;

    const existingRequest = await this.findOne({ email });

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

  async findOne(where: Prisma.RegisterRequestWhereUniqueInput) {
    return this.prismaService.registerRequest.findUnique({
      where,
    });
  }

  async findAll() {
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

  async updateStatus(updateRegisterRequestDto: UpdateRegisterRequestStatusDto) {
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

    let completeRegistrationUrl: string | undefined;

    if (updated.status == RegisterRequestStatus.APPROVED) {
      const tokenRecord = await this.registerRequestTokenService.generateToken(updated.id);
      completeRegistrationUrl = `${this.envService.get('CLIENT_URL')}/complete-registration?token=${tokenRecord.token}`;
    }

    await this.emailService.sendStatusUpdateEmail(
      updated.email,
      updated.status as RegisterRequestStatus,
      completeRegistrationUrl,
    );

    return updated;
  }

  async completeRegistration(dto: CompleteRegistrationDto) {
    const isTokenValid = await this.registerRequestTokenService.validateToken(dto.token);

    if (isTokenValid.isValid) {
      const { user, company } = dto;

      return await this.prismaService.$transaction(async (tx) => {
        const newCompany = await this.companiesService.create({
          ...company,
          registerRequestId: isTokenValid.registerRequestId,
        });

        const newUser = await this.usersService.createUser({
          ...user,
          role: Role.CLIENT_ADMIN,
        });

        const updatedUser = await tx.user.update({
          where: { id: newUser.id },
          data: { companyId: newCompany.id },
          select: { id: true, email: true },
        });

        return { userId: updatedUser.id, companyId: newCompany.id };
      });
    }

    throw new TRPCError({
      message: 'Your activation link is expired. Wait a new link',
      code: 'FORBIDDEN',
    });
  }
}
