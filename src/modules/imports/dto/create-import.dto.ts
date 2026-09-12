import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImportDto {
  @ApiProperty({ example: 'account-id' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ example: 'statement.csv' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ example: 'date,description,amount\n2026-09-01,COMPRA XYZ,100.00', description: 'CSV text, or base64-encoded bytes for PDF statements' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'generic' })
  @IsOptional()
  @IsString()
  parserType?: string;
}
