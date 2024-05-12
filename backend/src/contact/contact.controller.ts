import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '@nestjs/passport';
import { DistressCallInfo } from './dto/distress-call-info';
import { CreateContactDto } from './dto/create-contact';
import { ObjectId } from 'mongoose';
import { DeleteContactDto } from './dto/delete-contact';
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService){}

    @Post()
    @UseGuards(AuthGuard())
    async sendMail(@Body() info: DistressCallInfo) {
      return this.contactService.sendMail(info);
    }

    @Post('new')
    @UseGuards(AuthGuard())
    async newContact(@Body() contact: CreateContactDto): Promise<{status: string}> {
      return this.contactService.newContact(contact);
    }

    @Delete('user')
    @UseGuards(AuthGuard())
    async deleteContact(@Body() contact: DeleteContactDto): Promise<{status: string}> {
      return this.contactService.deleteContact(contact);
    }
  
    @Get('user/:id')
    @UseGuards(AuthGuard())
    async getLocationLog(@Param('id') id: ObjectId) {
      return this.contactService.getUserContacts(id);
    }
}
