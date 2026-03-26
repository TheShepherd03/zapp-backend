import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class EnquiriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(customerId: string, providerId: string, message: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        status: import("@prisma/client").$Enums.EnquiryStatus;
        providerId: string;
        customerId: string;
    }>;
    findForUser(userId: string, role: Role): Promise<({
        provider: {
            id: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        message: string;
        status: import("@prisma/client").$Enums.EnquiryStatus;
        providerId: string;
        customerId: string;
    })[] | ({
        customer: {
            id: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        message: string;
        status: import("@prisma/client").$Enums.EnquiryStatus;
        providerId: string;
        customerId: string;
    })[]>;
}
