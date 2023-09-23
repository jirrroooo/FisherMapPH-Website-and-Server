import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreatePositionDto {

    @IsNotEmpty()
    user_id: ObjectId;

    @IsNotEmpty()
    weather_id: ObjectId;

    @IsBoolean()
    isSailing: boolean;

    longitude: string;

    latitude: string;

    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    accuracy: number;

    altitude: number;

    heading: string;

    speed: number;

    speed_accuracy: number;

    sea_depth: number;
}
