import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma, Role } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS?.replace(/\s+/g, ''),
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: any) {
    const existing = await this.usersService.findOne(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userRole = data.role === 'PROVIDER' ? Role.PROVIDER : Role.CUSTOMER;
    
    const user = await this.usersService.create({
      email: data.email,
      passwordHash: hashedPassword,
      role: userRole,
      phone: data.phone,
    });
    
    const { passwordHash, ...result } = user;
    return result;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return { message: 'If the email exists, a password recovery link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    try {
      await this.transporter.sendMail({
        from: `"ZAPP Platform" <${process.env.GMAIL_USER}>`,
        to: email, // Free to send to absolutely any valid inbox now!
        subject: 'ZAPP Password Reset Link',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4F46E5;">Password Reset Request</h2>
            <p>We received a request to reset the password for your ZAPP account associated with ${email}.</p>
            <p>Click the button below to choose a new password securely:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin: 16px 0; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            <p>Or manually paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6B7280;"><a href="${resetLink}">${resetLink}</a></p>
            <p>If you didn't request this change, you can safely ignore this email. The link will expire in 1 hour.</p>
          </div>
        `
      });
      console.log(`\n============================`);
      console.log(`PASSWORD RESET DELIVERED VIA GMAIL TO: ${email}`);
      console.log(`============================\n`);
    } catch (err) {
      console.error('NODEMAILER ERROR:', err);
    }

    return { message: 'If the email exists, a password recovery link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    
    if (!user || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, {
      passwordHash: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { message: 'Password has been successfully updated' };
  }
}
