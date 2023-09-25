import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { WeathersController } from './weathers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherSchema } from './schemas/weathers.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Weather', schema: WeatherSchema}])],
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
