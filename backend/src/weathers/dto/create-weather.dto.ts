import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateWeatherDto {

    headline: string;

    msg_type: string;

    severity: string;

    urgency: string;

    areas: [string];

    category: string;

    event: string;

    @IsDate()
    @Type(() => Date)
    effective: Date;

    @IsDate()
    @Type(() => Date)
    expires: Date;

    description: string;

    instruction: string;
}
