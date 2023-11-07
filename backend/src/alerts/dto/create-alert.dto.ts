import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateAlertDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsString()
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

    @IsString()
    instruction: string;
}
