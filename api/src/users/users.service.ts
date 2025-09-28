import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateProfileDto,
  CreateUserDto,
  CreateUserWithProfileDto,
  FindCompanyUsersOptionsDto,
  UpdateProfileDto,
} from './user.schema';
import { TRPCError } from '@trpc/server';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { Role } from './user.schema';
import * as fs from 'fs/promises';
import * as path from 'node:path';

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
        profile: {
          include: {
            avatars: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    return {
      id: user!.id,
      role: user!.role,
      email: user!.email,
      companyId: user?.companyId || undefined,
      profile: user!.profile
        ? {
            id: user!.profile?.id,
            name: user!.profile?.name,
            surname: user!.profile?.surname,
            bio: user!.profile?.bio,
            employmentDate: user!.profile?.employmentDate,
            avatar: user!.profile.avatars[0]
              ? {
                  id: user!.profile.avatars[0].id,
                  path: user!.profile.avatars[0].path,
                }
              : undefined,
          }
        : undefined,
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
  async findAllUsers(companyId: string, findUsersInput: FindCompanyUsersOptionsDto) {
    return this.prismaService.user.findMany({
      where: {
        companyId,
        ...(findUsersInput.positionId && { positionId: findUsersInput.positionId }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        positionId: true,
        profile: {
          select: {
            id: true,
            name: true,
            surname: true,
            bio: true,
            employmentDate: true,
          },
        },
      },
    });
  }

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
          role: role ?? Role.USER,
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
          bio: bio ?? null,
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

  async createProfile(userId: string, dto: CreateProfileDto) {
    return this.prismaService.userProfile.create({
      data: {
        ...dto,
        userId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        bio: true,
        employmentDate: true,
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prismaService.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new TRPCError({
        message: 'Profile not found',
        code: 'NOT_FOUND',
      });
    }

    return this.prismaService.userProfile.update({
      where: { id: profile.id },
      data: {
        ...dto,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        bio: true,
        employmentDate: true,
      },
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const profile = await this.prismaService.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads/avatars');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const storagePath = `/uploads/avatars/${file.filename}`;

    const newFile = await this.prismaService.file.create({
      data: {
        filename: file.filename,
        path: storagePath,
        mimetype: file.mimetype,
        size: file.size,
        userProfileId: profile.id,
      },
      select: {
        id: true,
        filename: true,
        path: true,
      },
    });

    return newFile;
  }
}
