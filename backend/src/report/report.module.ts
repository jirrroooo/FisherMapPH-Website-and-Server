import { Module } from '@nestjs/common';
import { ReportsService } from './report.service';
import { ReportsController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/reports.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name: 'Report', schema: ReportSchema}])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportModule {}
