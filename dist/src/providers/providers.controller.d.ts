import { ProvidersService } from './providers.service';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    findAll(categoryId?: string, search?: string): Promise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            iconUrl: string | null;
        };
    } & {
        id: string;
        phone: string | null;
        businessName: string;
        description: string;
        website: string | null;
        address: string | null;
        lat: number | null;
        lng: number | null;
        categoryId: string;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createdAt: Date;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            iconUrl: string | null;
        };
    } & {
        id: string;
        phone: string | null;
        businessName: string;
        description: string;
        website: string | null;
        address: string | null;
        lat: number | null;
        lng: number | null;
        categoryId: string;
        userId: string;
    }>;
    updateProfile(req: any, body: any): Promise<{
        id: string;
        phone: string | null;
        businessName: string;
        description: string;
        website: string | null;
        address: string | null;
        lat: number | null;
        lng: number | null;
        categoryId: string;
        userId: string;
    }>;
}
