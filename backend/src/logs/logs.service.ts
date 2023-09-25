import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './schemas/logs.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

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

  async getLogs(): Promise<Log[]> {
    const alerts = await this.logModel.find().sort({createdAt: -1});
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
