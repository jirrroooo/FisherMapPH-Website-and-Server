import { Module } from '@nestjs/common';
import { ReportsService } from './report.service';
import { ReportsController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/reports.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PositionsModule } from 'src/positions/positions.module';
import { UserSchema } from 'src/users/schemas/users.schema';
import { PositionSchema } from 'src/positions/schemas/positions.schema';
import { LogSchema } from 'src/logs/schemas/logs.schema';

@Module({
  imports: [
    UsersModule,
    PositionsModule,
    AuthModule,
    MongooseModule.forFeature([{name: 'Report', schema: ReportSchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'Position', schema: PositionSchema}]),
    MongooseModule.forFeature([{name: 'Log', schema: LogSchema}]),

  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportModule {}
