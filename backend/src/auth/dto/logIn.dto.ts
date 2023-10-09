import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { ObjectId } from "mongoose";

export class LogInDto {
    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter correct email"})
    email_address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
