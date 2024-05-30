import { Injectable } from '@nestjs/common';
import { CreateBoundaryDto } from './dto/create-boundary.dto';
import { UpdateBoundaryDto } from './dto/update-boundary.dto';
import mongoose from 'mongoose';
import { Boundary } from './schemas/boundaries.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MapFunction } from 'functions/map_functions';
import { Query } from 'express-serve-static-core';

@Injectable()
export class BoundariesService {
  constructor(
    @InjectModel(Boundary.name)
    private boundaryModel: mongoose.Model<Boundary>,
  ) {}

  create(createBoundaryDto: CreateBoundaryDto) {
    return 'This action adds a new boundary';
  }

  async getCurrentLocation(query: Query){
    const mapFunction = new MapFunction();

    const boundaries = await this.boundaryModel.find();

    var b: Boundary;
    
    boundaries.forEach((boundary) => {
      if(mapFunction.isWithinBoundary(boundary.location, [parseFloat(query.longitude.toString()), parseFloat(query.latitude.toString())])){
        b = boundary;
      }
    });

    return b;
  }

  findAll() {
    return `This action returns all boundaries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boundary`;
  }

  update(id: number, updateBoundaryDto: UpdateBoundaryDto) {
    return `This action updates a #${id} boundary`;
  }

  remove(id: number) {
    return `This action removes a #${id} boundary`;
  }
}
