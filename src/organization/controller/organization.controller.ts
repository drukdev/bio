import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { LicenseDetails } from 'src/common/response.interface';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  public async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<CreateOrganizationDto> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  public async findAll(): Promise<CreateOrganizationDto[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<CreateOrganizationDto> {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<CreateOrganizationDto> {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<CreateOrganizationDto> {
    return this.organizationService.remove(id);
  }

  @Post('check-balance')
  public async checkBalance(@Body('orgdid') orgdid: string): Promise<string> {
    return this.organizationService.checkBalance(orgdid);
  }

  @Post('log-license')
  public async logLicense(@Body() payload: LicenseDetails): Promise<string> {
    return this.organizationService.logLicenseDetails(payload);
  }
}
