import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { ObjectId } from "mongoose";

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter correct email"})
    email_address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    profile_picture: string;

    @IsNotEmpty()
    @IsString()
    contact_number: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsDate()
    @Type(() => Date)
    birthday: Date;

    @IsNotEmpty()
    @IsString()
    civil_status: string;

    @IsNotEmpty()
    @IsString()
    user_type: string;

    @IsBoolean()
    isAuthenticated: string;

    membership_date: Date;

    @IsNotEmpty()
    @IsString()
    person_to_notify: string;

    @IsString()
    fishing_vessel_type: string;
}
