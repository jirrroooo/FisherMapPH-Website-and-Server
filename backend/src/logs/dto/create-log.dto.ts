import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateLogDto {

    @IsNotEmpty()
    user_id: ObjectId;

    manage_user: [ObjectId];

    manage_alert: [ObjectId];

    location_log: [ObjectId];

    alert_log: [ObjectId];

    permission: [string];

    report_log: [ObjectId];
}
