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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiriesController = void 0;
const common_1 = require("@nestjs/common");
const enquiries_service_1 = require("./enquiries.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EnquiriesController = class EnquiriesController {
    enquiriesService;
    constructor(enquiriesService) {
        this.enquiriesService = enquiriesService;
    }
    async create(req, body) {
        return this.enquiriesService.create(req.user.userId, body.providerId, body.message);
    }
    async getMyEnquiries(req) {
        return this.enquiriesService.findForUser(req.user.userId, req.user.role);
    }
};
exports.EnquiriesController = EnquiriesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "getMyEnquiries", null);
exports.EnquiriesController = EnquiriesController = __decorate([
    (0, common_1.Controller)('enquiries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [enquiries_service_1.EnquiriesService])
], EnquiriesController);
//# sourceMappingURL=enquiries.controller.js.map