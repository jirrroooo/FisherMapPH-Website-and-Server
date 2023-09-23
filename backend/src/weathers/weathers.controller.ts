import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeathersService } from './weathers.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Controller('weathers')
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Post()
  create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weathersService.create(createWeatherDto);
  }

  @Get()
  findAll() {
    return this.weathersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weathersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeatherDto: UpdateWeatherDto) {
    return this.weathersService.update(+id, updateWeatherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weathersService.remove(+id);
  }
}
