import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { AnyArray, ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Log{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: ObjectId;

    manage_user: [ObjectId];

    manage_alert: [ObjectId];

    location_log: [ObjectId];

    alert_log: [ObjectId];

    @Prop()
    permission: [string];

    report_log: [ObjectId];

}

export const LogSchema = SchemaFactory.createForClass(Log);