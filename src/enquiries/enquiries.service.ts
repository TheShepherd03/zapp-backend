import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, providerId: string, message: string) {
    return this.prisma.enquiry.create({
      data: {
        customerId,
        providerId,
        message,
      }
    });
  }

  async findForUser(userId: string, role: Role) {
    if (role === Role.CUSTOMER) {
      return this.prisma.enquiry.findMany({
        where: { customerId: userId },
        include: { provider: true }
      });
    } else {
      return this.prisma.enquiry.findMany({
        where: { providerId: userId },
        include: { customer: true }
      });
    }
  }
}
