import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCompanyDto } from './schema/companies.schema';

@Injectable()
export class CompaniesService implements OnModuleInit {
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

  async onModuleInit() {
    console.log(await this.findAll());
  }

  async findAll() {
    const companies = await this.prismaService.company.findMany({
      include: {
        directions: {
          include: {
            direction: {
              select: {
                name: true,
              },
            },
          },
        },
        companyLegalForm: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return companies.map((company) => ({
      ...company,
      directions: company.directions.map((d) => d.direction.name),
    }));
  }
}
