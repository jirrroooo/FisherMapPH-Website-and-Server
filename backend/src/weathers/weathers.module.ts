import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { WeathersController } from './weathers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherSchema } from './schemas/weathers.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name: 'Weather', schema: WeatherSchema}])],
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
