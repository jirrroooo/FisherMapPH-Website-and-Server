import { Module } from '@nestjs/common';
import { BoundariesService } from './boundaries.service';
import { BoundariesController } from './boundaries.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BoundarySchema } from './schemas/boundaries.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name: 'Boundary', schema: BoundarySchema}])
  ],
  controllers: [BoundariesController],
  providers: [BoundariesService],
})
export class BoundariesModule {}
