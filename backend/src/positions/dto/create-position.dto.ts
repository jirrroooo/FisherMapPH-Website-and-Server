import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreatePositionDto {

    @IsNotEmpty()
    user_id: ObjectId;

    @IsNumber()
    longitude: number;

    @IsNumber()
    latitude: number;

    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsNumber()
    accuracy: number;

    @IsNumber()
    altitude: number;

    @IsNumber()
    heading: number;

    @IsNumber()
    speed: number;

    @IsNumber()
    speed_accuracy: number;
}
