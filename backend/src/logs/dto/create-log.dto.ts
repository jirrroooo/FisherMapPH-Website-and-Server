import { Prop } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateLogDto {

    @IsNotEmpty()
    user_id: ObjectId;

    @Prop()
    manage_user: [ObjectId];

    @Prop()
    manage_alert: [ObjectId];

    @Prop()
    location_log: [ObjectId];

    @Prop()
    alert_log: [ObjectId];

    @Prop()
    permission: [string];

    @Prop()
    report_log: [ObjectId];
}
