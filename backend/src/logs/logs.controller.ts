import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ObjectId } from 'typeorm';
import { Log } from './schemas/logs.schema';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async newLog(@Body() log: CreateLogDto) {
    return this.logsService.newLog(log);
  }

  @Get()
  async getLogs(): Promise<Log[]> {
    return this.logsService.getLogs();
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
