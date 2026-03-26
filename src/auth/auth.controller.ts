import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
