import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NDILogger } from 'src/logger/logger.service';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerClsStore } from 'src/logger/logger.store';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly als: AsyncLocalStorage<LoggerClsStore>,
    private readonly ndiLogger: NDILogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  @ApiResponse({ status: 201, description: 'The organization has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<CreateOrganizationDto> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Return all organizations.'})
  public async findAll(): Promise<CreateOrganizationDto[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiResponse({ status: 200, description: 'Return an organization.'})
  public async findOne(@Param('id') id: string): Promise<CreateOrganizationDto> {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'The organization has been successfully updated.'})
  public async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<CreateOrganizationDto> {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'The organization has been successfully deleted.'})
  public async remove(@Param('id') id: string): Promise<CreateOrganizationDto> {
    return this.organizationService.remove(id);
  }

  @Post('check-balance')
  @ApiOperation({ summary: 'Check organization balance' })
  @ApiResponse({ status: 200, description: 'Return true if balance is sufficient, false otherwise.'})
  public async checkBalance(
    @Body('orgdid') orgdid: string,
    @Body('threadid') threadid?: string
  ): Promise<boolean> {
    return this.organizationService.checkBalance(orgdid, threadid);
  }
}
