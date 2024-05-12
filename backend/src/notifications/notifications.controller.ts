import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ObjectId } from 'mongoose';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  newNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.newNotification(createNotificationDto);
  }

  @Get('all')
  @UseGuards(AuthGuard())
  async getAllNotifications(@Query() query: ExpressQuery): Promise<Notification[]> {
    return this.notificationsService.getAllNotifications(query);
  }

  @Get('all-user/:id')
  @UseGuards(AuthGuard())
  async getAllUserNotification(@Param('id') id: ObjectId): Promise<Notification[]> {
    return this.notificationsService.getAllUserNotification(id);
  }
  
  @Get('specific-user/:id')
  @UseGuards(AuthGuard())
  async getSpecificUserNotification(@Param('id') id: ObjectId): Promise<Notification[]> {
    return this.notificationsService.getSpecificUserNotification(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  getSpecificNotification(@Param('id') id: ObjectId): Promise<Notification> {
    return this.notificationsService.getSpecificNotification(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updateNotification(
    @Param('id') id: ObjectId,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.updateNotification(id, updateNotificationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  removeNotification(@Param('id') id: ObjectId) {
    return this.notificationsService.removeNotification(id);
  }
}
