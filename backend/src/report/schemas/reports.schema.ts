import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";
import { Position } from "src/positions/schemas/positions.schema";

@Schema({
    timestamps: true
})
export class Report{
   
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Position'})
    position_id: ObjectId

    @Prop()
    type: string;

    @Prop()
    content: string;

    @Prop()
    status: string;

}

export const ReportSchema = SchemaFactory.createForClass(Report);