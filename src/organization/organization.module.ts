import { Module } from '@nestjs/common';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationService } from './services/organization.service';
import { PrismaService } from './repository/prisma.service';
import { AlsModule } from 'src/AsyncLocalStorage/als.module';
import { LoggerModule } from 'src/logger/logger.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AlsModule, LoggerModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [OrganizationController],
  providers: [OrganizationService, PrismaService]
})
export class OrganizationModule {}
