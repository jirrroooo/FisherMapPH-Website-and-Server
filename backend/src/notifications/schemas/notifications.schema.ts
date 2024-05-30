import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Notification{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: ObjectId;

    @Prop()
    isGeneralNotification: boolean

    @Prop()
    notification_title: string;
    
    @Prop()
    notification_body: string;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);