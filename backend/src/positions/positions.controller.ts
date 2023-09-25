import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ObjectId } from 'mongoose';
import { Position } from './schemas/positions.schema';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async newPosition(@Body() position: CreatePositionDto): Promise<Position> {
    return this.positionsService.newPosition(position);
  }

  @Get()
  async getPositions(): Promise<Position[]> {
    return this.positionsService.getPositions();
  }

  @Get(':id')
  async getPosition(@Param('id') id: ObjectId): Promise<Position> {
    return this.positionsService.getPosition(id);
  }

  @Patch(':id')
  async updatePosition(@Param('id') id: ObjectId, @Body() updatePositionDto: UpdatePositionDto): Promise<Position> {
    return this.positionsService.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  async removePosition(@Param('id') id: ObjectId): Promise<Position> {
    return this.positionsService.removePosition(id);
  }
}
