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

  async getAdminUsers(query: Query): Promise<User[]> {
    const responsePerPage = 6;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find({"user_type" : { $in: ["admin","superadmin"]}, "isAuthenticated" : true})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return users;
  }

  async getAdminPendingUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find({isAuthenticated: false, "user_type" : { $in: ["admin","superadmin"]}})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return users;
  }

  async getAdminRejectedUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find({"user_type" : { $in: ["admin-rejected","superadmin-rejected"]}})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return users;
  }

  async getFisherfolkUsers(query: Query): Promise<User[]> {
    const responsePerPage = 6;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find({"user_type" : "user", "isAuthenticated" : true})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return users;
  }

  async getFisherfolkPendingUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find({isAuthenticated: false, "user_type" : "user"})
    .sort({createdAt: -1})
    .limit(responsePerPage)
    .skip(skip);

    return users;
  }

  async getFisherfolkRejectedUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const users = await this.userModel.find({"user_type" : "user-rejected"})
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