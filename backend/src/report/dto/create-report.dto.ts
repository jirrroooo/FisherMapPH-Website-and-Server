import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateReportDto {

    @IsNotEmpty()
    user_id: ObjectId

    @IsNotEmpty()
    position_id: ObjectId;

    type: string;

    content: string;
}
