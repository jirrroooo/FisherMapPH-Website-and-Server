import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import mongoose, { ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { Notification } from './schemas/notifications.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: mongoose.Model<Notification>,
  ) {}

  async newNotification(
    log: CreateNotificationDto,
  ): Promise<{ status: string }> {
    const res = await this.notificationModel.create(log);

    if (res._id) {
      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  }

  async getAllNotifications(query: Query): Promise<Notification[]> {
    const responsePerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const notifications = await this.notificationModel
      .find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return notifications;
  }

  async getAllUserNotification(id: ObjectId): Promise<Notification[]> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid user id.');
    }

    const notification = await this.notificationModel
      .find({ $or: [{ user_id: id }, { isGeneralNotification: true }] })
      .sort({ createdAt: -1 });

    if (!notification) {
      throw new NotFoundException('No User Notification Found!');
    }

    return notification;
  }

  async getSpecificUserNotification(id: ObjectId): Promise<Notification[]> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid user id.');
    }

    const notification = await this.notificationModel
      .find({ user_id: id })
      .sort({ createdAt: -1 });

    if (!notification) {
      throw new NotFoundException('No User Notification Found!');
    }

    return notification;
  }

  async getSpecificNotification(id: ObjectId): Promise<Notification> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid notification id.');
    }

    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      throw new NotFoundException('No User Notification Found!');
    }

    return notification;
  }

  async updateNotification(id: ObjectId, updateNotificationDto: UpdateNotificationDto) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid notification ID.');
    }

    return await this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, {
      new: true,
      runValidators: true,
    });
  }

  async removeNotification(id: ObjectId){
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid notification ID.');
    }

    return await this.notificationModel.findByIdAndDelete(id);
  }
}
