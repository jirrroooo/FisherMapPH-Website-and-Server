import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { ContactSchema } from './schemas/contacts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/users.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
          }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            }
        }),
        AuthModule,
        MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema}]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),
    ],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
