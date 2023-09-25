import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateWeatherDto {

    @IsNotEmpty()
    @IsString()
    headline: string;

    @IsNotEmpty()
    @IsString()
    msg_type: string;

    @IsNotEmpty()
    @IsString()
    severity: string;

    @IsNotEmpty()
    @IsString()
    urgency: string;

    areas: [string];

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsString()
    event: string;

    @IsDate()
    @Type(() => Date)
    effective: Date;

    @IsDate()
    @Type(() => Date)
    expires: Date;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsString()
    instruction: string;
}
