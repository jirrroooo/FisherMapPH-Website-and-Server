import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})
export class Log{

    // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    // user_id: User;

    @Prop()
    manage_user: [string];

    @Prop()
    manage_alert: [string];

    @Prop()
    location_log: [string];

    @Prop()
    alert_log: [string];

    @Prop()
    permission: [string];

    @Prop()
    report_log: [string];

}

export const LogSchema = SchemaFactory.createForClass(Log);