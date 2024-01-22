import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './schemas/alerts.schema';
import { ObjectId } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @UseGuards(AuthGuard())
  async newAlert(@Body() alert: CreateAlertDto): Promise<Alert> {
    return this.alertsService.newAlert(alert);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getAlerts(@Query() query: ExpressQuery): Promise<Alert[]> {
    return this.alertsService.getAlerts(query);
  }

  @Get('total')
  @UseGuards(AuthGuard())
  async getTotalAlerts() {
    return this.alertsService.getTotalAlerts();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getAlert(@Param('id') id: ObjectId): Promise<Alert> {
    return this.alertsService.getAlert(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateAlert(@Param('id') id: ObjectId, @Body() updateAlertDto: UpdateAlertDto): Promise<Alert> {
    return this.alertsService.updateAlert(id, updateAlertDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removeAlert(@Param('id') id: ObjectId): Promise<Alert> {
    return this.alertsService.removeAlert(id);
  }
}
