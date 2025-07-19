import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgdid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgname: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  usage: number;
}
