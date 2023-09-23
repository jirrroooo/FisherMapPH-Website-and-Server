import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './schemas/alerts.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

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

  async getAlerts(): Promise<Alert[]> {
    const alerts = await this.alertModel.find().sort({createdAt: -1});
    return alerts;
  }

  async getAlert(id: ObjectId): Promise<Alert> {
    const alert = await this.alertModel.findById(id);

    if(!alert){
      throw new NotFoundException('Alert Not Found!');
    }

    return alert;
  }

  async updateAlert(id: ObjectId, updateAlertDto: UpdateAlertDto) {
    return await this.alertModel.findByIdAndUpdate(id, updateAlertDto, {
      new: true,
      runValidators: true
    })
  }

  async removeAlert(id: ObjectId) {
    return await this.alertModel.findByIdAndRemove(id);
  }
}
