import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { ObjectId } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  async newUser(@Body() user: CreateUserDto) {
    return this.usersService.newUser(user);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getUsers(
    @Query() query: ExpressQuery,
    @Req() request: Request,
  ): Promise<User[]> {
    try {
      const cookie = request.cookies['token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const users = await this.usersService.getUsers(query);

      return users;
    } catch (e) {
      throw new UnauthorizedException();
    }

    // return this.usersService.getUsers(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getUser(@Param('id') id: ObjectId): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateUser(
    @Param('id') id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removeUser(@Param('id') id: ObjectId): Promise<User> {
    return this.usersService.removeUser(id);
  }
}
