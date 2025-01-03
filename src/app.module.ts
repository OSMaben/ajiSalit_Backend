import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './company/company.module';
import { CommandModule } from './command/command.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/aaji-salit'), 
    CompanyModule,
    CommandModule,
    UserModule,
    NotificationsModule,
  ],
})
export class AppModule {}
