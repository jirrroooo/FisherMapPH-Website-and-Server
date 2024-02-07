import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { DistressCallInfo } from './dto/distress-call-info';

@Injectable()
export class ContactService {
    constructor(private readonly mailerService: MailerService){}

   async sendMail(info: DistressCallInfo){

        const result = this.mailerService.sendMail({
            from: "fishermap.ph@gmail.com",
            to: info.mail_list,
            subject: info.email_subject,
            text: info.text_message,
            html: info.html_message,
            cc: "fishermap.ph@gmail.com",
        });

        return result;
    }
}
