import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Position } from "src/positions/schemas/positions.schema";

@Schema({
    timestamps: true
})
export class Report{
   
    // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    // user_id: User;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Position'})
    position_id: Position

    @Prop()
    type: string;

    @Prop()
    content: string;

}

export const ReportSchema = SchemaFactory.createForClass(Report);