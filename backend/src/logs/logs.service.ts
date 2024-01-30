import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './schemas/logs.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { CreateLogDto } from './dto/create-log.dto';
import { User } from 'src/users/schemas/users.schema';
@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name)
    private logModel: mongoose.Model<Log>,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async newLog(log: CreateLogDto): Promise<{ status: string }> {
    const res = await this.logModel.create(log);

    if (res._id) {
      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  }

  async getLogs(query: Query): Promise<Log[]> {
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

    const logs = await this.logModel
      .find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return logs;
  }

  async getFisherfolkLogs() {
    const logs = await this.logModel.find().sort({ createdAt: -1 });

    let fisherfolkLogs = [];

    for (let i = 0; i < logs.length; i++) {
      let user = await this.userModel.findOne({ _id: logs[i].user_id });

      if (
        user.user_type == 'user' && user.isAuthenticated == true
      ) {
        fisherfolkLogs.push(logs[i]);
      }
    }

    return fisherfolkLogs;
  }

  async getTotalFisherfolkLogs() {
    const logs = await this.logModel.find().sort({ createdAt: -1 });

    let fisherfolkLogs = [];

    for (let i = 0; i < logs.length; i++) {
      let user = await this.userModel.findOne({ _id: logs[i].user_id });

      if (
        user.user_type == 'user' && user.isAuthenticated == true
      ) {
        fisherfolkLogs.push(logs[i]);
      }
    }

    return fisherfolkLogs.length;
  }

  async getAdminLogs() {
    const logs = await this.logModel.find().sort({ createdAt: -1 });

    let adminLogs = [];

    for (let i = 0; i < logs.length; i++) {
      let user = await this.userModel.findOne({ _id: logs[i].user_id });

      if (
        user.user_type == 'admin' && user.isAuthenticated == true
      ) {
        adminLogs.push(logs[i]);
      }
    }

    return adminLogs;
  }

  async getTotalAdminLogs() {
    const logs = await this.logModel.find().sort({ createdAt: -1 });

    let adminLogs = [];

    for (let i = 0; i < logs.length; i++) {
      let user = await this.userModel.findOne({ _id: logs[i].user_id });

      if (
        user.user_type == 'admin' && user.isAuthenticated == true
      ) {
        adminLogs.push(logs[i]);
      }
    }

    return adminLogs.length;
  }


  async getLog(id: ObjectId): Promise<Log> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const log = await this.logModel.findById(id);

    if (!log) {
      throw new NotFoundException('log Not Found!');
    }

    return log;
  }

  async updateLog(id: ObjectId, updateLogDto: UpdateLogDto) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.logModel.findByIdAndUpdate(id, updateLogDto, {
      new: true,
      runValidators: true,
    });
  }

  async removeLog(id: ObjectId) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.logModel.findByIdAndRemove(id);
  }
}
