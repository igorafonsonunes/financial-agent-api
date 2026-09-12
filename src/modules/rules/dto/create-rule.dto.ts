import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

export enum MatchTypeDto {
  EXACT = 'EXACT',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
}

export class CreateRuleDto {
  @ApiProperty({ example: 'IFOOD pizza rule' })
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiPropertyOptional({ example: 'Rule for food delivery' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'IFOOD*PIZZA' })
  @IsString()
  pattern: string;

  @ApiProperty({ enum: MatchTypeDto, example: MatchTypeDto.CONTAINS })
  @IsEnum(MatchTypeDto)
  matchType: MatchTypeDto;

  @ApiPropertyOptional({ example: 'merchant-id' })
  @IsOptional()
  @IsString()
  merchantId?: string;

  @ApiPropertyOptional({ example: 'category-id' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'subcategory-id' })
  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @ApiPropertyOptional({ example: 'profile-id' })
  @IsOptional()
  @IsString()
  profileId?: string;

  @ApiPropertyOptional({ example: 'Ifood Pizza' })
  @IsOptional()
  @IsString()
  displayNameTemplate?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isEssential?: boolean;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
