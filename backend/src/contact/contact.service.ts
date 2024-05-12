import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DistressCallInfo } from './dto/distress-call-info';
import { Contact } from './schemas/contacts.schema';
import mongoose, { ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactDto } from './dto/create-contact';
import { User } from 'src/users/schemas/users.schema';
import { DeleteContactDto } from './dto/delete-contact';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailerService: MailerService,

    @InjectModel(Contact.name)
    private contactModel: mongoose.Model<Contact>,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async sendMail(info: DistressCallInfo) {
    const result = this.mailerService.sendMail({
      from: 'fishermap.ph@gmail.com',
      to: info.mail_list,
      subject: info.email_subject,
      text: info.text_message,
      html: info.html_message,
      cc: 'fishermap.ph@gmail.com',
    });

    return result;
  }

  async newContact(contact: CreateContactDto): Promise<{ status: string }> {
    const res = await this.contactModel.create(contact);

    if (res._id) {
      const id = new mongoose.Types.ObjectId(contact.user_id.toString());

      const user = await this.userModel.findOne({ _id: contact.user_id });

      user.person_to_notify.push(res._id);

      const user_mod = await this.userModel.findOneAndReplace(id, user, {
        new: true,
        runValidators: true,
      });

      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  }

  async deleteContact(
    contact_info: DeleteContactDto,
  ): Promise<{ status: string }> {
    const res = await this.contactModel.findByIdAndDelete(
      contact_info.contact_id,
    );

    const id = new mongoose.Types.ObjectId(contact_info.user_id.toString());

    const user = await this.userModel.findOne({
      _id: id,
    });

    var new_contacts = [];

    user.person_to_notify.forEach((contact) => {
      if (contact != contact_info.contact_id) {
        new_contacts.push(contact);
      }
    });

    user.person_to_notify = new_contacts;

    const user_mod = await this.userModel.findOneAndReplace(id, user, {
      new: true,
      runValidators: true,
    });

    if (user_mod._id) {
      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  }

  async getUserContacts(id: ObjectId) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const user_contacts = await this.contactModel.find({ user_id: id });

    if (!user_contacts) {
      throw new NotFoundException('No Contacts Found!');
    }

    return user_contacts;
  }
}
