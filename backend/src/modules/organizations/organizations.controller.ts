import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationsService } from './organizations.service';
import { CurrentOrg } from '../../common/decorators/auth.decorators';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'))
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get('me')
  findMyOrg(@CurrentOrg() org: any) {
    return this.service.findOne(org.id);
  }

  @Patch('me')
  updateMyOrg(@CurrentOrg() org: any, @Body() dto: UpdateOrganizationDto) {
    return this.service.update(org.id, dto);
  }
}
