import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Report } from './schemas/reports.schema';

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

  async getReports(): Promise<Report[]> {
    const reports = await this.reportModel.find().sort({createdAt: -1});
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
