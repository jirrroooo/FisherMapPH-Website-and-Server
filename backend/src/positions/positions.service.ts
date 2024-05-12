import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Position } from './schemas/positions.schema';
import { Query } from 'express-serve-static-core';
import { Log } from 'src/logs/schemas/logs.schema';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name)
    private positionModel: mongoose.Model<Position>,

    @InjectModel(Log.name)
    private logModel: mongoose.Model<Log>
  ){}

  async newPosition(position: Position): Promise<Position>{
    const positionResponse = await this.positionModel.create(position);

    const logResponse = await this.logModel.findOne({user_id: position.user_id});

    var positionId = new mongoose.Types.ObjectId(positionResponse._id.toString());

    var new_location_log: any = [];

    new_location_log.push(positionId);

    logResponse.location_log.forEach((log) => {
      new_location_log.push(log);
    });

    logResponse.location_log = new_location_log;

    const res = await this.logModel.findByIdAndUpdate(logResponse._id, logResponse, {
      new: true,
      runValidators: true,
    });

    return positionResponse;
  }

  async getPositions(query: Query): Promise<Position[]> {
    const responsePerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const positions = await this.positionModel.find()
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return positions;
  }

  async getPosition(id: ObjectId): Promise<Position> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    const position = await this.positionModel.findById(id);

    if(!position){
      throw new NotFoundException('Position Not Found!');
    }

    return position;
  }

  async updatePosition(id: ObjectId, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.positionModel.findByIdAndUpdate(id, updatePositionDto, {
      new: true,
      runValidators: true
    })
  }

  async removePosition(id: ObjectId): Promise<Position> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }
    
    return await this.positionModel.findByIdAndRemove(id);
  }
}
