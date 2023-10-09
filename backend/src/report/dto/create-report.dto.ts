import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateReportDto {

    @IsNotEmpty()
    user_id: ObjectId

    @IsNotEmpty()
    position_id: ObjectId;

    @IsString()
    type: string;

    @IsString()
    content: string;
}
