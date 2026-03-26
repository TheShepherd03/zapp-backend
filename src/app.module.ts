import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProvidersModule } from './providers/providers.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, CategoriesModule, ProvidersModule, EnquiriesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
