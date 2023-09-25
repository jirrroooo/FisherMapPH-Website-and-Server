import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ObjectId } from 'mongoose';
import { Log } from './schemas/logs.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async newLog(@Body() log: CreateLogDto) {
    return this.logsService.newLog(log);
  }

  @Get()
  async getLogs(@Query() query: ExpressQuery): Promise<Log[]> {
    return this.logsService.getLogs(query);
  }

  @Get(':id')
  async getLog(@Param('id') id: ObjectId) {
    return this.logsService.getLog(id);
  }

  @Patch(':id')
  async updateLog(@Param('id') id: ObjectId, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.updateLog(id, updateLogDto);
  }

  @Delete(':id')
  async removeLog(@Param('id') id: ObjectId) {
    return this.logsService.removeLog(id);
  }
}
