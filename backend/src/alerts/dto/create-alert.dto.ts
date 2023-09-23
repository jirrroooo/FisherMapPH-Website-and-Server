import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateAlertDto {

    title: string;

    description: string;

    location: string;

    level: string;

    @IsBoolean()
    isSpecific: boolean;

    specified_user: [string];

    notified_user: [string];

    @IsDate()
    @Type(() => Date)
    effective: Date;

    @IsDate()
    @Type(() => Date)
    expires: Date;

    @IsDate()
    @Type(() => Date)
    instruction: Date;
}
