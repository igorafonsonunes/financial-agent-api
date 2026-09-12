import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

export enum TransactionTypeDto {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  OTHER = 'OTHER',
}

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionTypeDto, example: TransactionTypeDto.EXPENSE })
  @IsEnum(TransactionTypeDto)
  type: TransactionTypeDto;

  @ApiProperty({ example: 'Compra XYZ' })
  @IsString()
  @Length(2, 200)
  description: string;

  @ApiPropertyOptional({ example: 'COMPRA XYZ' })
  @IsOptional()
  @IsString()
  normalizedDescription?: string;

  @ApiPropertyOptional({ example: 'Compra XYZ 03/12' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: 'merchant-id' })
  @IsOptional()
  @IsString()
  merchantId?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  installmentTotal?: number;

  @ApiProperty({ example: 125000 })
  @IsInt()
  totalAmountCents: number;

  @ApiPropertyOptional({ example: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'Notas da operação' })
  @IsOptional()
  @IsString()
  notes?: string;
}
