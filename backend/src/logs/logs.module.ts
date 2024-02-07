import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './schemas/logs.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/users/schemas/users.schema';
import { UsersModule } from 'src/users/users.module';
import { PositionSchema } from 'src/positions/schemas/positions.schema';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema}]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{ name: 'Position', schema: PositionSchema}])
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
