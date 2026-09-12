import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ example: 'iFood' })
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiPropertyOptional({ example: 'IFOOD' })
  @IsOptional()
  @IsString()
  normalizedName?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ example: 'Marketplace de entregas' })
  @IsOptional()
  @IsString()
  notes?: string;
}
