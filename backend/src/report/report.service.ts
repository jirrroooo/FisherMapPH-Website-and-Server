import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Report } from './schemas/reports.schema';

import { Query } from 'express-serve-static-core';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: mongoose.Model<Report>
  ){}

  async newReport(report: Report): Promise<Report>{
    const res = await this.reportModel.create(report);
    return res;
  }

  async getReports(query: Query): Promise<Report[]> {
    const responsePerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const reports = await this.reportModel.find()
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return reports;
  }

  async getReport(id: ObjectId): Promise<Report> {
    const report = await this.reportModel.findById(id);

    if(!report){
      throw new NotFoundException('Report Not Found!');
    }

    return report;
  }

  async updateReport(id: ObjectId, updateReportDto: UpdateReportDto): Promise<Report> {
    return await this.reportModel.findByIdAndUpdate(id, updateReportDto, {
      new: true,
      runValidators: true
    })
  }

  async removeReport(id: ObjectId): Promise<Report> {
    return await this.reportModel.findByIdAndRemove(id);
  }
}
