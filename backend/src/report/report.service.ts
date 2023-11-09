import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    private positionModel: mongoose.Model<Position>
  ){}

  async newReport(report: Report): Promise<Report>{
    const res = await this.reportModel.create(report);
    return res;
  }

  async getReports(query: Query) {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    let reports:any = await this.reportModel.find()
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    let userInfo = {};
    let positionInfo = {};

    reports = await reports.reduce((promise: any, report: any) => (
      promise.then(async result => (
        result.concat({
          userInfo : await this.userModel.findOne(report.user_id),
          positionInfo: await this.positionModel.findOne(report.position_id),
          report : await {...userInfo, ...positionInfo[0], ...report._doc}
        })
      ))
    ), Promise.resolve([]));
    
    return reports;
  }

  async getReport(id: ObjectId): Promise<Report> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    const report = await this.reportModel.findById(id);

    if(!report){
      throw new NotFoundException('Report Not Found!');
    }

    return report;
  }

  async updateReport(id: ObjectId, updateReportDto: UpdateReportDto): Promise<Report> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.reportModel.findByIdAndUpdate(id, updateReportDto, {
      new: true,
      runValidators: true
    })
  }

  async removeReport(id: ObjectId): Promise<Report> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.reportModel.findByIdAndRemove(id);
  }
}
