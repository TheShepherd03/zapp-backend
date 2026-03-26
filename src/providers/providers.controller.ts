import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async findAll(
    @Query('category') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.providersService.findAll(categoryId, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.providersService.upsertProfile(req.user.userId, body);
  }
}
