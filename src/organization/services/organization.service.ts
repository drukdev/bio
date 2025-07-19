import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repository/prisma.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: createOrganizationDto });
  }

  findAll() {
    return this.prisma.organization.findMany();
  }

  findOne(id: string) {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  remove(id: string) {
    return this.prisma.organization.delete({ where: { id } });
  }

  async checkBalance(orgdid: string): Promise<boolean> {
    const organization = await this.prisma.organization.findUnique({
      where: { orgdid },
    });

    if (organization && organization.balance > 0) {
      return true;
    }

    return false;
  }

  async logLicenseDetails(payload: any) {
    const { orgdid, usage, request, response } = payload;
    const organization = await this.prisma.organization.findUnique({
      where: { orgdid },
    });

    if (organization) {
      await this.prisma.organization.update({
        where: { orgdid },
        data: {
          balance: organization.balance - 1,
          usage: organization.usage + 1,
        },
      });

      await this.prisma.log.create({
        data: {
          organizationId: organization.id,
          request,
          response,
        },
      });
    }
  }
}
