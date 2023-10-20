import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

import { Query } from 'express-serve-static-core';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>
  ){}

  async newUser(user: User): Promise<User>{
    const res = await this.userModel.create(user);
    return res;
  }

  async getUsers(query: Query): Promise<User[]> {
    const responsePerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find()
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return users;
  }

  async getUser(id: ObjectId): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    const user = await this.userModel.findById(id);

    if(!user){
      throw new NotFoundException('User Not Found!');
    }

    // const {password, ...user2} = user;

    return user;
  }

  async updateUser(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true
    })
  }

  async removeUser(id: ObjectId): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if(!isValidId){
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.userModel.findByIdAndRemove(id);
  }
}