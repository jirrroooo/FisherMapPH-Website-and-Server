import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreatePositionDto {

    @IsNotEmpty()
    user_id: ObjectId;

    @IsNotEmpty()
    weather_id: ObjectId;

    @IsBoolean()
    isSailing: boolean;

    @IsString()
    longitude: string;

    @IsString()
    latitude: string;

    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsNumber()
    accuracy: number;

    @IsNumber()
    altitude: number;

    @IsString()
    heading: string;

    @IsNumber()
    speed: number;

    @IsNumber()
    speed_accuracy: number;

    @IsNumber()
    sea_depth: number;
}
