import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string, search?: string) {
    return this.prisma.providerProfile.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(search ? {
          businessName: { contains: search }
        } : {})
      },
      include: {
        category: true,
      }
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { id },
      include: { category: true, user: true }
    });
    if (!profile) throw new NotFoundException('Provider not found');
    return profile;
  }

  async upsertProfile(userId: string, data: any) {
    return this.prisma.providerProfile.upsert({
      where: { userId },
      update: {
        businessName: data.businessName,
        description: data.description,
        phone: data.phone,
        website: data.website,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        categoryId: data.categoryId,
      },
      create: {
        userId,
        businessName: data.businessName,
        description: data.description,
        phone: data.phone,
        website: data.website,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        categoryId: data.categoryId,
      }
    });
  }
}
