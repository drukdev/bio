import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repository/prisma.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { LicenseDetails } from 'src/common/response.interface';
import { NDILogger } from 'src/logger/logger.service';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerClsStore } from 'src/logger/logger.store';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private readonly als: AsyncLocalStorage<LoggerClsStore>,
    private readonly ndiLogger: NDILogger,
    ) {}

  public async create(createOrganizationDto: CreateOrganizationDto): Promise<CreateOrganizationDto> {
    return this.prisma.organization.create({ data: createOrganizationDto });
  }

  public async findAll(): Promise<CreateOrganizationDto[]> {
    return this.prisma.organization.findMany();
  }

  public async findOne(id: string): Promise<CreateOrganizationDto> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  public async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<CreateOrganizationDto> {
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto
    });
  }

  public async remove(id: string): Promise<CreateOrganizationDto> {
    return this.prisma.organization.delete({ where: { id } });
  }

  public async checkBalance(orgdid: string, threadid?: string): Promise<boolean> {
    const ndiLogger = this.ndiLogger.getLoggerInstance(this.als);
    const organization = await this.prisma.organization.findUnique({
      where: { orgdid }
    });

    if (!organization) {
        ndiLogger.log(`Organization with orgdid ${orgdid} not found`);
        return false;
    }

    if (organization.limit === 0) {
        ndiLogger.log(`Organization with orgdid ${orgdid} has no limit set`);
        this.updateAndLogOrganization({
            orgdid,
            threadid,
            usage: organization.usage + 1,
            balance: organization.balance - 1
        });
        return true;
    }

    if (organization.balance > 0) {
        ndiLogger.log(`Organization with orgdid ${orgdid} has a balance of ${organization.balance}`);
        this.updateAndLogOrganization({
            orgdid,
            threadid,
            usage: organization.usage + 1,
            balance: organization.balance - 1
        });
        return true;
    } else {
        ndiLogger.log(`Organization with orgdid ${orgdid} has insufficient balance`);
        this.updateAndLogOrganization({
            orgdid,
            threadid,
            usage: organization.usage + 1,
            balance: organization.balance -1
        });
        return false;
    }
  }

  public async updateAndLogOrganization(payload: {
    orgdid: string;
    threadid?: string;
    usage: number;
    balance: number;
    similarityScore?: number;
  }): Promise<void> {
    const { orgdid, threadid, usage, balance, similarityScore } = payload;
    const organization = await this.prisma.organization.findUnique({
      where: { orgdid }
    });

    if (organization) {
      await this.prisma.organization.update({
        where: { orgdid },
        data: {
          balance,
          usage
        }
      });

      await this.prisma.log.create({
        data: {
          organizationId: organization.id,
          threadid,
          similarityScore
        }
      });
    }
  }
}
