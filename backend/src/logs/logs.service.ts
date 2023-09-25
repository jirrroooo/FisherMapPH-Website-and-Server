import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './schemas/logs.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { Query } from 'express-serve-static-core';
@Injectable()
export class LogsService {

  constructor(
    @InjectModel(Log.name)
    private logModel: mongoose.Model<Log>
  ){}

  async newLog(log: Log): Promise<Log> {
    const res = await this.logModel.create(log);
    return res;
  }

  async getLogs(query: Query): Promise<Log[]> {
    const responsePerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const alerts = await this.logModel.find({...keyword})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);
    return alerts;
  }

  async getLog(id: ObjectId): Promise<Log> {
    const log = await this.logModel.findById(id);

    if(!log){
      throw new NotFoundException('log Not Found!');
    }

    return log;
  }

  async updateLog(id: ObjectId, updateLogDto: UpdateLogDto) {
    return await this.logModel.findByIdAndUpdate(id, updateLogDto, {
      new: true,
      runValidators: true
    })
  }

  async removeLog(id: ObjectId) {
    return await this.logModel.findByIdAndRemove(id);
  }
}
