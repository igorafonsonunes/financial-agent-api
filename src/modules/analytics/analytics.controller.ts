import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Return dashboard summary and aggregated analytics' })
  @ApiQuery({ name: 'month', required: false, type: String, description: 'Period month in YYYY-MM format' })
  async dashboard(@Query('month') month?: string) {
    const period = month
      ? {
          start: new Date(`${month}-01T00:00:00.000Z`),
          end: new Date(`${month}-31T23:59:59.999Z`),
        }
      : {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999),
        };

    return this.analyticsService.getDashboard(period);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Return monthly aggregated values' })
  async monthly() {
    return this.analyticsService.getMonthly();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Return category aggregation for charts' })
  async categories() {
    return this.analyticsService.getCategories();
  }

  @Get('comparison')
  @ApiOperation({ summary: 'Compare current snapshot versus previous period' })
  async comparison() {
    return this.analyticsService.getComparison();
  }
}
