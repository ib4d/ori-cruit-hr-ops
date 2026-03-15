import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentOrg() org: any) {
    return this.service.create(dto, org.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
    @CurrentOrg() org: any,
  ) {
    return this.service.updateStatus(id, dto, org.id);
  }

  @Get()
  findAll(@CurrentOrg() org: any) {
    return this.service.findAll(org.id);
  }
}
