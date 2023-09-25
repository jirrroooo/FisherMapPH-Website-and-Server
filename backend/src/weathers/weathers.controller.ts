import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { Weather } from './schemas/weathers.schema';
import { ObjectId } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Post()
  async newWeather(@Body() weather: CreateWeatherDto): Promise<Weather> {
    return this.weathersService.newWeather(weather);
  }

  @Get()
  async getWeathers(@Query() query: ExpressQuery): Promise<Weather[]> {
    return this.weathersService.getWeathers(query);
  }

  @Get(':id')
  async getWeather(@Param('id') id: ObjectId): Promise<Weather> {
    return this.weathersService.getWeather(id);
  }

  @Patch(':id')
  async updateWeather(@Param('id') id: ObjectId, @Body() updateWeatherDto: UpdateWeatherDto): Promise<Weather> {
    return this.weathersService.updateWeather(id, updateWeatherDto);
  }

  @Delete(':id')
  async removeWeather(@Param('id') id: ObjectId): Promise<Weather> {
    return this.weathersService.removeWeather(id);
  }
}
