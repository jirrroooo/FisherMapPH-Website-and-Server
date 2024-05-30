import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionSchema } from './schemas/positions.schema';
import { AuthModule } from 'src/auth/auth.module';
import { LogSchema } from 'src/logs/schemas/logs.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name: 'Position', schema: PositionSchema}]),
    MongooseModule.forFeature([{name: 'Log', schema: LogSchema}])
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
