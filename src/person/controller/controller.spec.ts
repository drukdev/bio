import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './controller';
import { BiometricService } from '../services/biometricService';
import { ConfigService } from '@nestjs/config';
import { AsyncLocalStorage } from 'async_hooks';
import { NDILogger } from '../../logger/logger.service';
import { OrganizationService } from '../../organization/services/organization.service';
import { BiometricRepository } from '../repository/biometricsRepository';
import { SystemRepository } from '../repository/systemRepository';
import { S3Service } from '../../aws-s3/s3.service';

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: BiometricService,
          useValue: {
            compareImage: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: NDILogger,
          useValue: {
            getLoggerInstance: jest.fn().mockReturnValue({
              log: jest.fn(),
              debug: jest.fn(),
              error: jest.fn(),
            }),
          },
        },
        {
          provide: AsyncLocalStorage,
          useValue: {
            getStore: jest.fn(),
            run: jest.fn(),
          },
        },
        {
          provide: BiometricRepository,
          useValue: {},
        },
        {
          provide: SystemRepository,
          useValue: {},
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: OrganizationService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
