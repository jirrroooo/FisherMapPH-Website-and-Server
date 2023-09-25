import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Position } from './schemas/positions.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name)
    private positionModel: mongoose.Model<Position>
  ){}

  async newPosition(position: Position): Promise<Position>{
    const res = await this.positionModel.create(position);
    return res;
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
    const position = await this.positionModel.findById(id);

    if(!position){
      throw new NotFoundException('Position Not Found!');
    }

    return position;
  }

  async updatePosition(id: ObjectId, updatePositionDto: UpdatePositionDto): Promise<Position> {
    return await this.positionModel.findByIdAndUpdate(id, updatePositionDto, {
      new: true,
      runValidators: true
    })
  }

  async removePosition(id: ObjectId): Promise<Position> {
    return await this.positionModel.findByIdAndRemove(id);
  }
}
