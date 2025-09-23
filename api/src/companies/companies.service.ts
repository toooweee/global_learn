import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCompanyDto } from './companies.schema';

@Injectable()
export class CompaniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prismaService.company.create({
      data: {
        ...createCompanyDto,
        directions: {
          create: createCompanyDto.directions.map((direction) => ({
            directionId: direction,
          })),
        },
      },
    });
  }
}
