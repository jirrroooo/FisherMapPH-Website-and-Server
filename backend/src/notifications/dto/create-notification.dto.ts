import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { ObjectId } from "typeorm";


export class CreateNotificationDto {
    @Prop()
    user_id: ObjectId;

    @Prop()
    isGeneralNotification: boolean;

    @Prop()
    notification_title: string;

    @Prop()
    notification_body: string;
}
