import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './schemas/logs.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { ObjectId } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { CreateLogDto } from './dto/create-log.dto';
import { User } from 'src/users/schemas/users.schema';
import { Position } from 'src/positions/schemas/positions.schema';
import { Alert } from 'src/alerts/schemas/alerts.schema';
import { AlertLogDto } from 'src/logs/dto/alert-log.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name)
    private logModel: mongoose.Model<Log>,

    @InjectModel(Alert.name)
    private alertModel: mongoose.Model<Alert>,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,

    @InjectModel(Position.name)
    private positionModel: mongoose.Model<User>,
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

    const serializedData = logs.map((doc) => JSON.stringify(doc));
    const objectData = serializedData.map((doc) => JSON.parse(doc));

    let fisherfolkLogs = [];
    let position: any;
    let user: any;

    for (const log of objectData) {
      user = await this.userModel
        .findOne({ _id: log.user_id })
        .select('-password');

      if (log.location_log != undefined) {
        position = await this.positionModel.findOne({
          _id: log.location_log[0],
        });
      }

      if (
        user &&
        user.user_type == 'user' &&
        user.isAuthenticated == true &&
        position != null &&
        position != undefined
      ) {
        fisherfolkLogs.push({ log: log, user: user, position: position });
      }
    }
    return fisherfolkLogs;
  }

  async getTotalFisherfolkLogs() {
    const logs = await this.logModel.find().sort({ createdAt: -1 });

    let fisherfolkLogs = [];

    for (let i = 0; i < logs.length; i++) {
      let user = await this.userModel.findOne({ _id: logs[i].user_id });

      if (user.user_type == 'user' && user.isAuthenticated == true) {
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

      if (user.user_type == 'admin' && user.isAuthenticated == true) {
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

      if (user.user_type == 'admin' && user.isAuthenticated == true) {
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

  async getAlertLogs(id: ObjectId) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const log = await this.logModel.findOne({ user_id: id });

    if (!log) {
      throw new NotFoundException('log Not Found!');
    }

    const serializedData = JSON.stringify(log);
    const objectData = JSON.parse(serializedData);

    const alert_logs = [];

    for (const alert of objectData.alert_log) {
      const alertLog = await this.alertModel.findOne({ _id: alert });
      if (alertLog) {
        alert_logs.push(alertLog);
      } else {
        // console.error(`Alert log not found for ID ${alert}`);
      }
    }

    return alert_logs;
  }

  async getLocationLogs(id: ObjectId) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const log = await this.logModel.findOne({ user_id: id });

    if (!log) {
      throw new NotFoundException('log Not Found!');
    }

    const serializedData = JSON.stringify(log);
    const objectData = JSON.parse(serializedData);

    const location_logs = [];

    for (const location of objectData.location_log) {
      const locationLog = await this.positionModel.findOne({ _id: location });
      if (locationLog) {
        location_logs.push(locationLog);
      } else {
        // console.error(`Alert log not found for ID ${location}`);
      }
    }

    return location_logs;
  }

  async addAlertToLog(alertLogDto: AlertLogDto) {
    const user_id = new mongoose.Types.ObjectId(alertLogDto.user_id.toString());
    const alert_id = new mongoose.Types.ObjectId(alertLogDto.alert_id.toString());


    const log = await this.logModel.findOne({ user_id: user_id });

    if (!log) {
      throw new NotFoundException('User log not found');
    }

    var new_report_log: any = [];

    var new_log: any = [];

    new_log.push(alert_id);

    log.alert_log.forEach((alert) => {
      new_log.push(alert);
    });

    log.alert_log = new_log;

    const updatedLog = await this.logModel.findByIdAndUpdate(log._id, log, {
      new: true,
      runValidators: true,
    });

    if (!updatedLog) {
      return { status: 'failed' };
    }

    return { status: 'success' };
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

  async usersLogCorrection(): Promise<{ success: string }> {
    const users = await this.userModel.find().select('-password');
    let result: any;

    users.forEach(async (user) => {
      result = await this.logModel.find({ user_id: user._id });

      if (result.length == 0) {
        const newLog: CreateLogDto = {
          user_id: user.id,
          manage_user: null,
          manage_alert: null,
          location_log: null,
          alert_log: null,
          permission: null,
          report_log: null,
        };

        this.newLog(newLog);
      }
    });

    users.forEach(async (user) => {
      result = await this.logModel.find({ user_id: user._id });

      if (result.length == 0) {
        return { success: 'false' };
      }
    });

    return { success: 'true' };
  }
}
