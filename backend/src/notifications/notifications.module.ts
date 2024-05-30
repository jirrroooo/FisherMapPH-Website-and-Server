import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationSchema } from './schemas/notifications.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AuthModule,
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema}]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
