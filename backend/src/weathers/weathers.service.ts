import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Weather } from './schemas/weathers.schema';
import mongoose, { ObjectId } from 'mongoose';

import { Query } from 'express-serve-static-core';
@Injectable()
export class WeathersService {
  constructor(
    @InjectModel(Weather.name)
    private weatherModel: mongoose.Model<Weather>
  ){}

  async newWeather(weather: Weather): Promise<Weather>{
    const res = await this.weatherModel.create(weather);
    return res;
  }

  async getWeathers(query: Query): Promise<Weather[]> {
    const responsePerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}
    
    const weathers = await this.weatherModel.find()
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return weathers;
  }

  async getWeather(id: ObjectId): Promise<Weather> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    const weather = await this.weatherModel.findById(id);

    if(!weather){
      throw new NotFoundException('Weather Not Found!');
    }

    return weather;
  }

  async updateWeather(id: ObjectId, updateWeatherDto: UpdateWeatherDto): Promise<Weather> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.weatherModel.findByIdAndUpdate(id, updateWeatherDto, {
      new: true,
      runValidators: true
    })
  }

  async removeWeather(id: ObjectId): Promise<Weather> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.weatherModel.findByIdAndRemove(id);
  }
}