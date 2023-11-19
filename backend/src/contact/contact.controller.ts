import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '@nestjs/passport';
import { DistressCallInfo } from './dto/distress-call-info';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService){}

    @Post()
    @UseGuards(AuthGuard())
    async sendMail(@Body() info: DistressCallInfo) {
      return this.contactService.sendMail(info);
    }
}
