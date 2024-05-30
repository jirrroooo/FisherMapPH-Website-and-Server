import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Position{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: ObjectId;

    @Prop()
    longitude: number;

    @Prop()
    latitude: number;

    @Prop()
    timestamp: Date;

    @Prop()
    accuracy: number;

    @Prop()
    altitude: number;

    @Prop()
    heading: number;

    @Prop()
    speed: number;

    @Prop()
    speed_accuracy: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);