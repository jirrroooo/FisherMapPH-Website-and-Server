import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { Weather } from './schemas/weathers.schema';
import { ObjectId } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Post()
  @UseGuards(AuthGuard())
  async newWeather(@Body() weather: CreateWeatherDto): Promise<Weather> {
    return this.weathersService.newWeather(weather);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getWeathers(@Query() query: ExpressQuery): Promise<Weather[]> {
    return this.weathersService.getWeathers(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getWeather(@Param('id') id: ObjectId): Promise<Weather> {
    return this.weathersService.getWeather(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateWeather(@Param('id') id: ObjectId, @Body() updateWeatherDto: UpdateWeatherDto): Promise<Weather> {
    return this.weathersService.updateWeather(id, updateWeatherDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removeWeather(@Param('id') id: ObjectId): Promise<Weather> {
    return this.weathersService.removeWeather(id);
  }
}
