import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BoundariesService } from './boundaries.service';
import { CreateBoundaryDto } from './dto/create-boundary.dto';
import { UpdateBoundaryDto } from './dto/update-boundary.dto';
import { AuthGuard } from '@nestjs/passport';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Boundary } from './schemas/boundaries.schema';

@Controller('boundaries')
export class BoundariesController {
  constructor(private readonly boundariesService: BoundariesService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createBoundaryDto: CreateBoundaryDto) {
    return this.boundariesService.create(createBoundaryDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.boundariesService.findAll();
  }

  @Get('current-location')
  @UseGuards(AuthGuard())
  async getCurrentLocation(@Query() query: ExpressQuery): Promise<Boundary> {
    return this.boundariesService.getCurrentLocation(query);
  }


  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.boundariesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateBoundaryDto: UpdateBoundaryDto) {
    return this.boundariesService.update(+id, updateBoundaryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.boundariesService.remove(+id);
  }
}
