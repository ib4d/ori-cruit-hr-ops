import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('pipeline-summary')
  getPipelineSummary(@CurrentOrg() org: any) {
    return this.dashboardService.getPipelineSummary(org.id);
  }

  @Get('kpis')
  getKpis(@CurrentOrg() org: any) {
    return this.dashboardService.getKpis(org.id);
  }

  @Get('legal-queue-preview')
  getLegalQueuePreview(@CurrentOrg() org: any) {
    return this.dashboardService.getLegalQueuePreview(org.id);
  }

  @Get('today-actions')
  getTodayActions(@CurrentOrg() org: any) {
    return this.dashboardService.getTodayActions(org.id);
  }

  @Get('integrations-status')
  getIntegrationsStatus(@CurrentOrg() org: any) {
    return this.dashboardService.getIntegrationsStatus(org.id);
  }
}
