import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Position } from './schemas/positions.schema';

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

  async getPositions(): Promise<Position[]> {
    const positions = await this.positionModel.find().sort({createdAt: -1});
    return positions;
  }

  async getPosition(id: ObjectId): Promise<Position> {
    const position = await this.positionModel.findById(id);

    if(!position){
      throw new NotFoundException('Position Not Found!');
    }

    return position;
  }

  async updatePosition(id: ObjectId, updatePositionDto: UpdatePositionDto) {
    return await this.positionModel.findByIdAndUpdate(id, updatePositionDto, {
      new: true,
      runValidators: true
    })
  }

  async removePosition(id: ObjectId) {
    return await this.positionModel.findByIdAndRemove(id);
  }
}
