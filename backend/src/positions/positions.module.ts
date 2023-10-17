import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionSchema } from './schemas/positions.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name: 'Position', schema: PositionSchema}])
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
