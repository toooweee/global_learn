import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateDirectionDto, UpdateDirectionDto } from './schema/directions.schema';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

@Injectable()
export class DirectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDirectionDto: CreateDirectionDto) {
    try {
      return this.prismaService.direction.create({
        data: {
          ...createDirectionDto,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new TRPCError({
          message: `Direction with name ${createDirectionDto.name} already exists`,
          code: 'CONFLICT',
        });
      }
    }
  }

  async findAll() {
    return this.prismaService.direction.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.direction.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateDirectionDto: UpdateDirectionDto) {
    return this.prismaService.direction.update({
      where: {
        id,
      },
      data: {
        ...updateDirectionDto,
      },
    });
  }

  async delete(id: string) {
    return this.prismaService.direction.delete({
      where: {
        id,
      },
    });
  }
}
