import { EnquiriesService } from './enquiries.service';
export declare class EnquiriesController {
    private readonly enquiriesService;
    constructor(enquiriesService: EnquiriesService);
    create(req: any, body: {
        providerId: string;
        message: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        status: import("@prisma/client").$Enums.EnquiryStatus;
        providerId: string;
        customerId: string;
    }>;
    getMyEnquiries(req: any): Promise<({
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
