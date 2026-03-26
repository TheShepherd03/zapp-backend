import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    private transporter;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(data: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
