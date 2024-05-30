import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { PositionsModule } from './positions/positions.module';
import { ReportModule } from './report/report.module';
import { LogsModule } from './logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BoundariesModule } from './boundaries/boundaries.module';
import { EmergencyContactsModule } from './emergency-contacts/emergency-contacts.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
  }),
  AlertsModule, UsersModule,
  PositionsModule, ReportModule, LogsModule,
  MongooseModule.forRoot(process.env.DB_URI),
  AuthModule,
  ContactModule,
  NotificationsModule,
  BoundariesModule,
  EmergencyContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
