import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionSchema } from './schemas/positions.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Position', schema: PositionSchema}])],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
