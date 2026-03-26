"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProvidersService = class ProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(categoryId, search) {
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
    async findOne(id) {
        const profile = await this.prisma.providerProfile.findUnique({
            where: { id },
            include: { category: true, user: true }
        });
        if (!profile)
            throw new common_1.NotFoundException('Provider not found');
        return profile;
    }
    async upsertProfile(userId, data) {
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
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map