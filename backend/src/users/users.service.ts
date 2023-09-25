import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

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

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().sort({createdAt: -1});
    return users;
  }

  async getUser(id: ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);

    if(!user){
      throw new NotFoundException('User Not Found!');
    }

    return user;
  }

  async updateUser(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true
    })
  }

  async removeUser(id: ObjectId): Promise<User> {
    return await this.userModel.findByIdAndRemove(id);
  }
}