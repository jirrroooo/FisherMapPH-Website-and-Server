import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ObjectId } from 'mongoose';
import { Report } from './schemas/reports.schema';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard())
  async newReport(@Body() report: CreateReportDto): Promise<Report> {
    return this.reportsService.newReport(report);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getReports(@Query() query: ExpressQuery) {
    return await this.reportsService.getReports(query);
  }

  @Get('total')
  @UseGuards(AuthGuard())
  async getTotalReports() {
    return this.reportsService.getTotalReports();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getReport(@Param('id') id: ObjectId): Promise<Report> {
    return this.reportsService.getReport(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateReport(@Param('id') id: ObjectId, @Body() updateReportDto: UpdateReportDto): Promise<Report> {
    return this.reportsService.updateReport(id, updateReportDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removeReport(@Param('id') id: ObjectId): Promise<Report> {
    return this.reportsService.removeReport(id);
  }
}