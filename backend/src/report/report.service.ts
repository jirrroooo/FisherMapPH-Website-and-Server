import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Report } from './schemas/reports.schema';

import { Query } from 'express-serve-static-core';
import { User } from 'src/users/schemas/users.schema';
import { Position } from 'src/positions/schemas/positions.schema';
import { Log } from 'src/logs/schemas/logs.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: mongoose.Model<Report>,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,

    @InjectModel(Position.name)
    private positionModel: mongoose.Model<Position>,

    @InjectModel(Log.name)
    private logModel: mongoose.Model<Log>,
  ) {}

  async getTotalReports() {
    return (await this.reportModel.find()).length;
  }

  async newReport(report: Report): Promise<Report> {
    const reportResponse = await this.reportModel.create(report);

    const logResponse = await this.logModel.findOne({
      user_id: report.user_id,
    });

    var reportId = new mongoose.Types.ObjectId(reportResponse._id.toString());

    var new_report_log: any = [];

    new_report_log.push(reportId);

    logResponse.report_log.forEach((report) => {
      new_report_log.push(report);
    });

    logResponse.report_log = new_report_log;

    const res = await this.logModel.findByIdAndUpdate(
      logResponse._id,
      logResponse,
      {
        new: true,
        runValidators: true,
      },
    );

    return reportResponse;
  }

  async getReports(query: Query): Promise<Report[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    var reports: any;
    let userInfo = {};
    let positionInfo = {};

    if (query.search && query.status) {
      if (query.sort) {
        reports = await this.reportModel
          .find(
            query.searchBy == 'alert_type'
              ? {
                  type: new RegExp(`${query.search}`, 'i'),
                  status: query.status
                }
              : {
                  content: new RegExp(`${query.search}`, 'i'),
                  status: query.status
                },
          )
          .sort(
            query.sort == 'alphabetical' && query.searchBy == 'alert_type'
              ? { type: 1 }
              : query.sort != 'alphabetical' && query.searchBy == 'alert_type'
              ? { type: -1 }
              : query.sort == 'alphabetical' && query.searchBy == 'message'
              ? { type: 1 }
              : { type: -1 },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);
      } else if (!query.sort) {
        reports = await this.reportModel
          .find(
            query.searchBy == 'alert_type'
              ? {
                  type: new RegExp(`${query.search}`, 'i'),
                  status: query.status
                }
              : {
                  content: new RegExp(`${query.search}`, 'i'),
                  status: query.status
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);
      }
    } else if (query.search && !query.status) {
      if (query.sort) {
        reports = await this.reportModel
          .find(
            query.searchBy == 'alert_type'
              ? {
                  type: new RegExp(`${query.search}`, 'i'),
                }
              : {
                  content: new RegExp(`${query.search}`, 'i'),
                },
          )
          .sort(
            query.sort == 'alphabetical' && query.searchBy == 'alert_type'
              ? { type: 1 }
              : query.sort != 'alphabetical' && query.searchBy == 'alert_type'
              ? { type: -1 }
              : query.sort == 'alphabetical' && query.searchBy == 'message'
              ? { type: 1 }
              : { type: -1 },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);
      } else if (!query.sort) {
        reports = await this.reportModel
          .find(
            query.searchBy == 'alert_type'
              ? {
                  type: new RegExp(`${query.search}`, 'i'),
                }
              : {
                  content: new RegExp(`${query.search}`, 'i'),
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);
      }
    } else if (!query.search && !query.map && !query.status) {
      reports = await this.reportModel
        .find()
        .sort({ createdAt: -1 })
        .limit(responsePerPage)
        .skip(skip);
    } else if (query.map) {
      reports = await this.reportModel.find().sort({ createdAt: -1 });
    }

    reports = await reports.reduce(
      (promise: any, report: any) =>
        promise.then(async (result) =>
          result.concat({
            userInfo: await this.userModel.findOne(report.user_id),
            positionInfo: await this.positionModel.findOne(report.position_id),
            report: await { ...userInfo, ...positionInfo[0], ...report._doc },
          }),
        ),
      Promise.resolve([]),
    );
    return reports;
  }

  async getUserReports(id: ObjectId) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    let positionInfo = {};
    var reports = await this.reportModel
      .find({ user_id: id })
      .sort({ createdAt: -1 });

    if (!reports) {
      throw new NotFoundException('log Not Found!');
    }

    reports = await reports.reduce(
      (promise: any, report: any) =>
        promise.then(async (result) =>
          result.concat({
            positionInfo: await this.positionModel.findOne(report.position_id),
            report: await { ...positionInfo[0], ...report._doc },
          }),
        ),
      Promise.resolve([]),
    );

    return reports;
  }

  async getReport(id: ObjectId): Promise<Report> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const report = await this.reportModel.findById(id);

    if (!report) {
      throw new NotFoundException('Report Not Found!');
    }

    return report;
  }

  async updateReport(
    id: ObjectId,
    updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.reportModel.findByIdAndUpdate(id, updateReportDto, {
      new: true,
      runValidators: true,
    });
  }

  async removeReport(id: ObjectId): Promise<Report> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.reportModel.findByIdAndRemove(id);
  }
}
