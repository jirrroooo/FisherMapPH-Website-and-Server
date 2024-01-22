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

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: mongoose.Model<Report>,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,

    @InjectModel(Position.name)
    private positionModel: mongoose.Model<Position>,
  ) {}

  async getTotalReports(){
    return (await this.reportModel.find()).length;
  }

  async newReport(report: Report): Promise<Report> {
    const res = await this.reportModel.create(report);
    return res;
  }

  async getReports(query: Query): Promise<Report[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    var reports: any;
    let userInfo = {};
    let positionInfo = {};


    if (query.search) {
      if (query.searchBy != 'status') {
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
      } else if (query.searchBy == 'status') {
        if (query.sort) {
          reports = await this.reportModel
            .find({
              status: new RegExp(`${query.search}`, 'i'),
            })
            .sort({ status: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

        }else if(!query.sort){
          reports = await this.reportModel.find({
            status: new RegExp(`${query.search}`, 'i'),
          });
  
        }
      }
    } else if (!query.search) {

      reports = await this.reportModel
        .find()
        .sort({ createdAt: -1 })
        .limit(responsePerPage)
        .skip(skip);

    }


    reports = await reports.reduce(
      (promise: any, report: any) =>
        promise.then(async (result) =>
          result.concat({
            userInfo: await this.userModel.findOne(report.user_id),
            positionInfo: await this.positionModel.findOne(
              report.position_id,
            ),
            report: await { ...userInfo, ...positionInfo[0], ...report._doc },
          }),
        ),
      Promise.resolve([]),
    );

    console.log(reports);

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
