import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Weather } from './schemas/weathers.schema';
import mongoose, { ObjectId } from 'mongoose';

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

  async getWeathers(): Promise<Weather[]> {
    const weathers = await this.weatherModel.find().sort({createdAt: -1});
    return weathers;
  }

  async getWeather(id: ObjectId): Promise<Weather> {
    const weather = await this.weatherModel.findById(id);

    if(!weather){
      throw new NotFoundException('Weather Not Found!');
    }

    return weather;
  }

  async updateWeather(id: ObjectId, updateWeatherDto: UpdateWeatherDto) {
    return await this.weatherModel.findByIdAndUpdate(id, updateWeatherDto, {
      new: true,
      runValidators: true
    })
  }

  async removeWeather(id: ObjectId) {
    return await this.weatherModel.findByIdAndRemove(id);
  }
}