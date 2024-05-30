import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { AnyArray, ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Log{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
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

export const LogSchema = SchemaFactory.createForClass(Log);