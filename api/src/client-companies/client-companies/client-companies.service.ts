import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { TRPCError } from '@trpc/server';
import { UpdateCompanyDto } from './schema/client-companies.schema';

@Injectable()
export class ClientCompaniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(companyId: string, id?: string) {
    const where = id ? { id } : { id: companyId };
    const company = await this.prismaService.company.findUnique({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        foundationDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
    }

    if (company.id !== companyId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
    }

    return company;
  }

  async update(companyId: string, updateCompanyDto: UpdateCompanyDto) {
    const { id, ...data } = updateCompanyDto;

    const existingCompany = await this.prismaService.company.findUnique({
      where: { id: id || companyId },
    });

    if (!existingCompany) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
    }

    if (existingCompany.id !== companyId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
    }

    return this.prismaService.company.update({
      where: { id: id || companyId },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        foundationDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
