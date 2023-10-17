import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './schemas/logs.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema}])
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
