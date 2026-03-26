import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: any;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
}
