import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ObjectId } from 'mongoose';
import { Position } from './schemas/positions.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';


@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @UseGuards(AuthGuard())
  async newPosition(@Body() position: CreatePositionDto): Promise<Position> {
    return this.positionsService.newPosition(position);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getPositions(@Query() query: ExpressQuery): Promise<Position[]> {
    return this.positionsService.getPositions(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getPosition(@Param('id') id: ObjectId): Promise<Position> {
    return this.positionsService.getPosition(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updatePosition(@Param('id') id: ObjectId, @Body() updatePositionDto: UpdatePositionDto): Promise<Position> {
    return this.positionsService.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removePosition(@Param('id') id: ObjectId): Promise<Position> {
    return this.positionsService.removePosition(id);
  }
}
