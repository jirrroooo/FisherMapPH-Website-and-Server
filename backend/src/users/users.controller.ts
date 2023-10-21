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

  @Get('/admin-users')
  @UseGuards(AuthGuard())
  async getAdminUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getAdminUsers(query);
  }

  @Get('/admin-pending-users')
  @UseGuards(AuthGuard())
  async getAdminPendingUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getAdminPendingUsers(query);
  }

  @Get('admin-rejected-users')
  @UseGuards(AuthGuard())
  async getAdminRejectedUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getAdminRejectedUsers(query);
  }

  @Get('admin-users')
  @UseGuards(AuthGuard())
  async getUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getAdminUsers(query);
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
