import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './schemas/alerts.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

import { Query } from 'express-serve-static-core';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name)
    private alertModel: mongoose.Model<Alert>
  ){}

  async newAlert(alert: Alert): Promise<Alert>{
    const res = await this.alertModel.create(alert);
    return res;
  }

  async getAlerts(query: Query): Promise<Alert[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}
    
    const alerts = await this.alertModel.find({...keyword})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);
    
    return alerts;
  }

  async getAlert(id: ObjectId): Promise<Alert> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    const alert = await this.alertModel.findById(id);

    if(!alert){
      throw new NotFoundException('Alert Not Found!');
    }

    return alert;
  }

  async updateAlert(id: ObjectId, updateAlertDto: UpdateAlertDto): Promise<Alert> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.alertModel.findByIdAndUpdate(id, updateAlertDto, {
      new: true,
      runValidators: true
    })
  }

  async removeAlert(id: ObjectId): Promise<Alert> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.alertModel.findByIdAndRemove(id);
  }
}
