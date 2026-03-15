import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser, CurrentOrg } from '../../common/decorators/auth.decorators';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.service.findOne(user.sub);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.service.update(user.sub, dto);
  }

  @Get('org-members')
  getOrgMembers(@CurrentOrg() org: any) {
    return this.service.findByOrg(org.id);
  }
}
