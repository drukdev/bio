import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repository/prisma.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '@prisma/client';
import { LicenseDetails } from 'src/common/response.interface';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  public async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.prisma.organization.create({ data: createOrganizationDto });
  }

  public async findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany();
  }

  public async findOne(id: string): Promise<Organization> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  public async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto
    });
  }

  public async remove(id: string): Promise<Organization> {
    return this.prisma.organization.delete({ where: { id } });
  }

  public async checkBalance(orgdid: string): Promise<string> {
    const organization = await this.prisma.organization.findUnique({
      where: { orgdid }
    });

    if (organization && 0 < organization.balance) {
      return 'true';
    }

    return 'false';
  }

  public async logLicenseDetails(payload: LicenseDetails): Promise<string> {
    const { orgdid, request, response } = payload;
    const organization = await this.prisma.organization.findUnique({
      where: { orgdid }
    });

    if (organization) {
      await this.prisma.organization.update({
        where: { orgdid },
        data: {
          balance: organization.balance - 1,
          usage: organization.usage + 1
        }
      });

      await this.prisma.log.create({
        data: {
          organizationId: organization.id,
          request,
          response
        }
      });
    }
    return 'true';
  }
}
