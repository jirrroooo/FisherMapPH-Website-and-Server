import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './schemas/alerts.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

import { Query } from 'express-serve-static-core';
import { Coordinates, DataPoint, MapFunction } from 'functions/map_functions';
import { filter } from 'rxjs';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name)
    private alertModel: mongoose.Model<Alert>,
  ) {}

  async newAlert(alert: Alert): Promise<Alert> {
    const res = await this.alertModel.create(alert);
    return res;
  }

  async getAlerts(query: Query) {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    let alerts: any;

    if (query.search) {
      if (query.searchBy != 'level') {
        if (query.sort) {
          const alphabetical = this.alertModel
            .find(
              query.searchBy == 'title'
                ? {
                    title: new RegExp(`${query.search}`, 'i'),
                  }
                : {
                    description: new RegExp(`${query.search}`, 'i'),
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'title'
                ? { title: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'title'
                ? { title: -1 }
                : query.sort == 'alphabetical' &&
                  query.searchBy == 'description'
                ? { description: 1 }
                : { description: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.alertModel
          .find(
            query.searchBy == 'title'
              ? {
                  title: new RegExp(`${query.search}`, 'i'),
                }
              : {
                  description: new RegExp(`${query.search}`, 'i'),
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'level') {
        if (query.sort) {
          const alphabetical = this.alertModel
            .find({
              level: new RegExp(`${query.search}`, 'i'),
            })
            .sort({ title: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByLevel = await this.alertModel.find({
          level: new RegExp(`${query.search}`, 'i'),
        });

        return searchByLevel;
      }
    } else if (!query.search && !query.map) {
      alerts = await this.alertModel
        .find()
        .limit(responsePerPage)
        .skip(skip);
    }else if(query.map){
      alerts = await this.alertModel.find();
    }

    return alerts;
  }

  async getUserMapAlerts(query: Query){
    const alerts = await this.alertModel.find();

    var active_alerts = [];

    alerts.forEach((alert) => {
      if(new Date() >= alert.effective && new Date() < alert.expires){
        active_alerts.push(alert);
      }
    });

    const mapFunction = new MapFunction();

    const coordinate: Coordinates = {
      longitude: parseFloat(query.longitude.toString()),
      latitude: parseFloat(query.latitude.toString())
    }

    const filteredDataPoints = mapFunction.filterDataByRadius(active_alerts, coordinate, parseFloat(query.radius.toString()));

    return filteredDataPoints;
  }

  async getTotalAlerts() {
    return (await this.alertModel.find()).length;
  }

  async getAlert(id: ObjectId): Promise<Alert> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const alert = await this.alertModel.findById(id);

    if (!alert) {
      throw new NotFoundException('Alert Not Found!');
    }

    return alert;
  }

  async updateAlert(
    id: ObjectId,
    updateAlertDto: UpdateAlertDto,
  ): Promise<Alert> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.alertModel.findByIdAndUpdate(id, updateAlertDto, {
      new: true,
      runValidators: true,
    });
  }

  async removeAlert(id: ObjectId): Promise<Alert> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.alertModel.findByIdAndRemove(id);
  }
}
