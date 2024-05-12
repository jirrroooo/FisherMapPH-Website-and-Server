import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmpty, IsLatitude, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class DistressCallInfo {

    @IsArray()
    mail_list: []

    @IsString()
    email_subject: string;

    @IsString()
    text_message: string;

    @IsString()
    html_message: string;

}
