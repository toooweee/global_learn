import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto, CreateUserWithProfileDto } from './user.schema';
import { TRPCError } from '@trpc/server';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new TRPCError({
        message: `User with email ${createUserDto.email} already exists`,
        code: 'CONFLICT',
      });
    }

    const hashedPassword = await argon.hash(password);

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findAllUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findUser(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        message: 'User not found',
        code: 'NOT_FOUND',
      });
    }

    return user;
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user.findUnique({
      where,
    });

    if (!user) {
      throw new TRPCError({
        message: 'User not found',
        code: 'NOT_FOUND',
      });
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new TRPCError({
        message: 'User not found',
        code: 'NOT_FOUND',
      });
    }

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new TRPCError({
        message: 'User not found',
        code: 'NOT_FOUND',
      });
    }

    return this.prismaService.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async me(id?: string) {
    if (!id) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        company: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      id: user!.id,
      role: user!.role,
      email: user!.email,
      companyId: user?.companyId || undefined,
    };
  }

  async comparePassword(hashedPassword: string, password: string) {
    const isPasswordMatching = await argon.verify(hashedPassword, password);

    if (!isPasswordMatching) {
      throw new TRPCError({
        message: 'Invalid credentials',
        code: 'UNAUTHORIZED',
      });
    }

    return isPasswordMatching;
  }

  // for companies
  async createUserWithProfile(companyId: string, createUserWithProfileDto: CreateUserWithProfileDto) {
    const { email, password, role, name, surname, bio, employmentDate, positionId } = createUserWithProfileDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new TRPCError({
        message: `User with email ${email} already exists`,
        code: 'CONFLICT',
      });
    }

    const existingCompany = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      throw new TRPCError({
        message: `Company with ID ${companyId} not found`,
        code: 'NOT_FOUND',
      });
    }

    if (positionId) {
      const existingPosition = await this.prismaService.position.findUnique({
        where: { id: positionId },
      });

      if (!existingPosition) {
        throw new TRPCError({
          message: `Position with ID ${positionId} not found`,
          code: 'NOT_FOUND',
        });
      }
    }

    const hashedPassword = await argon.hash(password);

    return await this.prismaService.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          companyId,
          positionId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          companyId: true,
        },
      });

      const newProfile = await tx.userProfile.create({
        data: {
          name,
          surname,
          bio,
          employmentDate: new Date(employmentDate),
          userId: newUser.id,
        },
        select: {
          id: true,
          name: true,
          surname: true,
          bio: true,
          employmentDate: true,
        },
      });

      return {
        ...newUser,
        profile: newProfile,
      };
    });
  }
}
