import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateLogDto {

    @IsNotEmpty()
    user_id: ObjectId

    manage_user: [string];

    manage_alert: [string];

    location_log: [string];

    alert_log: [string];

    permission: [string];

    report_log: [string];
}
