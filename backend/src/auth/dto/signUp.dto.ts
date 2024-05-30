import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    sex: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter correct email"})
    email_address: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    contact_number: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    
    @IsNotEmpty()
    @IsString()
    region: string;

    @IsDate()
    @Type(() => Date)
    birthday: Date;

    @IsNotEmpty()
    @IsString()
    civil_status: string;

    @IsNotEmpty()
    @IsString()
    user_type: string;

    @IsOptional()
    @IsBoolean()
    isAuthenticated = false;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    membership_date = null;

    @IsOptional()
    @IsString()
    person_to_notify = "";

    @IsOptional()
    @IsString()
    fishing_vessel_type = "";
}
