import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ObjectId } from 'mongoose';
import { Report } from './schemas/reports.schema';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async newReport(@Body() report: CreateReportDto): Promise<Report> {
    return this.reportsService.newReport(report);
  }

  @Get()
  async getReports(): Promise<Report[]> {
    return this.reportsService.getReports();
  }

  @Get(':id')
  async getReport(@Param('id') id: ObjectId) {
    return this.reportsService.getReport(id);
  }

  @Patch(':id')
  async updateReport(@Param('id') id: ObjectId, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.updateReport(id, updateReportDto);
  }

  @Delete(':id')
  async removeReport(@Param('id') id: ObjectId) {
    return this.reportsService.removeReport(id);
  }
}