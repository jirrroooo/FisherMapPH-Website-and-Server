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
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { ObjectId } from 'mongoose';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}


  @Post()
  @UseGuards(AuthGuard())
  async newUser(@Body() user: CreateUserDto) {
    return this.usersService.newUser(user);
  }

  @Get('admin-users')
  @UseGuards(AuthGuard())
  async getAdminUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getAdminUsers(query);
  }

  @Get('admin-pending-users')
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

  @Get('fisherfolk-users')
  @UseGuards(AuthGuard())
  async getFisherfolkUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getFisherfolkUsers(query);
  }

  @Get('fisherfolk-pending-users')
  @UseGuards(AuthGuard())
  async getFisherfolkPendingUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getFisherfolkPendingUsers(query);
  }

  @Get('fisherfolk-rejected-users')
  @UseGuards(AuthGuard())
  async getFisherfolkRejectedUsers(
    @Query() query: ExpressQuery,
  ): Promise<User[]> {
    return this.usersService.getFisherfolkRejectedUsers(query);
  }

  @Get('total-fisherfolk-users')
  @UseGuards(AuthGuard())
  async getTotalFisherfolkUsers(){
    return this.usersService.getTotalFisherfolkUsers();
  }

  @Get('total-fisherfolk-pending-users')
  @UseGuards(AuthGuard())
  async getTotalFisherfolkPendingUsers(){
    return this.usersService.getTotalFisherfolkPendingUsers();
  }

  @Get('total-admin-pending-users')
  @UseGuards(AuthGuard())
  async getTotalAdminPendingUsers(){
    return this.usersService.getTotalAdminPendingUsers();
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

  // @Patch('contact/:id')
  // @UseGuards(AuthGuard())
  // async updateContact(
  //   @Param('id') id: ObjectId,
  //   @Body() contactObject: any,
  // ): Promise<User> {
  //   return this.usersService.updateContact(id, contactObject);
  // }

  // @Delete('contact/:id')
  // @UseGuards(AuthGuard())
  // async deleteContact(
  //   @Param('id') id: ObjectId,
  //   @Body() contactObject: any,
  // ): Promise<User> {
  //   return this.usersService.deleteContact(id, contactObject);
  // }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async removeUser(@Param('id') id: ObjectId): Promise<User> {
    return this.usersService.removeUser(id);
  }
}
