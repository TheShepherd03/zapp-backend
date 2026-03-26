"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const client_1 = require("@prisma/client");
const nodemailer = __importStar(require("nodemailer"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    transporter;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS?.replace(/\s+/g, ''),
            },
        });
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async register(data) {
        const existing = await this.usersService.findOne(data.email);
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userRole = data.role === 'PROVIDER' ? client_1.Role.PROVIDER : client_1.Role.CUSTOMER;
        const user = await this.usersService.create({
            email: data.email,
            passwordHash: hashedPassword,
            role: userRole,
            phone: data.phone,
        });
        const { passwordHash, ...result } = user;
        return result;
    }
    async forgotPassword(email) {
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
                to: email,
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
        }
        catch (err) {
            console.error('NODEMAILER ERROR:', err);
        }
        return { message: 'If the email exists, a password recovery link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || !user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (new Date() > user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, {
            passwordHash: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });
        return { message: 'Password has been successfully updated' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map