import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './schemas/alerts.schema';
import { ObjectId } from 'mongoose';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async newAlert(@Body() alert: CreateAlertDto) {
    return this.alertsService.newAlert(alert);
  }

  @Get()
  async getAlerts(): Promise<Alert[]> {
    return this.alertsService.getAlerts();
  }

  @Get(':id')
  async getAlert(@Param('id') id: ObjectId) {
    return this.alertsService.getAlert(id);
  }

  @Patch(':id')
  async updateAlert(@Param('id') id: ObjectId, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.updateAlert(id, updateAlertDto);
  }

  @Delete(':id')
  async removeAlert(@Param('id') id: ObjectId) {
    return this.alertsService.removeAlert(id);
  }
}
