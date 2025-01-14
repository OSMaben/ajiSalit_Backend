import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { CommandModule } from './command/command.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/Aji-Salit'),
    CompanyModule,
    CommandModule,
    UserModule,
    NotificationsModule,
  ],
})
export class AppModule {}