import { Module } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { WeathersController } from './weathers.controller';

@Module({
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
