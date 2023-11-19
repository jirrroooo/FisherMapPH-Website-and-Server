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

    // @IsDate()
    // date_time: Date;

    // @IsString()
    // type: string;

    // @IsString()
    // message: string;

    // @IsString()
    // status: string;

    // @IsNumber()
    // latitude: number;

    // @IsNumber()
    // longitude: number;

    // @IsString()
    // fishing_vessel_type: string;

    // @IsNumber()
    // sea_depth: number;

    // @IsString()
    // fisherfolk_name: string;

    // @IsString()
    // contact_number: string;

    // @IsString()
    // person_to_notify: string;

    // @IsString()
    // address: string;

}
