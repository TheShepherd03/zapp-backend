import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(email: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByResetToken(resetToken: string): Promise<User | null>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}
