import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty, IsOptional } from "class-validator";
;
import { ObjectId } from "typeorm";


export class CreateNotificationDto {
    @IsOptional()
    user_id: ObjectId;

    @Prop()
    isGeneralNotification: boolean;

    @Prop()
    notification_title: string;

    @Prop()
    notification_body: string;
}
