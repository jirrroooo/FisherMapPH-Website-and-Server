import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertSchema } from './schemas/alerts.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Alert', schema: AlertSchema}])],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
