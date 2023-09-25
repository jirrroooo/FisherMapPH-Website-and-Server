import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { ObjectId } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async newUser(@Body() user: CreateUserDto) {
    return this.usersService.newUser(user);
  }

  @Get()
  async getUsers(@Query() query: ExpressQuery): Promise<User[]> {
    return this.usersService.getUsers(query);
  }

  @Get(':id')
  async getUser(@Param('id') id: ObjectId): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: ObjectId): Promise<User> {
    return this.usersService.removeUser(id);
  }
}