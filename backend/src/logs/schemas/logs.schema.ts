import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Log{

    // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    // user_id: User;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    manage_user: [ObjectId];

    @Prop()
    manage_alert: [string];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Position'})
    location_log: [ObjectId];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Alert'})
    alert_log: [ObjectId];

    @Prop()
    permission: [string];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Report'})
    report_log: [ObjectId];

}

export const LogSchema = SchemaFactory.createForClass(Log);