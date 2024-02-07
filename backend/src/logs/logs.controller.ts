import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
// import { ObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Log } from './schemas/logs.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async newLog(@Body() log: CreateLogDto): Promise<{status: string}> {
    return this.logsService.newLog(log);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getLogs(@Query() query: ExpressQuery): Promise<Log[]> {
    return this.logsService.getLogs(query);
  }

  @Get('fisherfolkLogs')
  @UseGuards(AuthGuard())
  async getFisherfolkLogs() {
    return this.logsService.getFisherfolkLogs();
  }

  @Get('totalFisherfolkLogs')
  @UseGuards(AuthGuard())
  async getTotalFisherfolkLogs() {
    return this.logsService.getTotalFisherfolkLogs();
  }

  @Get('adminLogs')
  @UseGuards(AuthGuard())
  async getAdminLogs() {
    return this.logsService.getAdminLogs();
  }

  @Get('totalAdminLogs')
  @UseGuards(AuthGuard())
  async getTotalAdminLogs() {
    return this.logsService.getTotalAdminLogs();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getLog(@Param('id') id: ObjectId) {
    return this.logsService.getLog(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateLog(@Param('id') id: ObjectId, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.updateLog(id, updateLogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removeLog(@Param('id') id: ObjectId) {
    return this.logsService.removeLog(id);
  }
}
