import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('enquiries')
@UseGuards(JwtAuthGuard)
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { providerId: string, message: string }) {
    return this.enquiriesService.create(req.user.userId, body.providerId, body.message);
  }

  @Get()
  async getMyEnquiries(@Request() req: any) {
    return this.enquiriesService.findForUser(req.user.userId, req.user.role);
  }
}
