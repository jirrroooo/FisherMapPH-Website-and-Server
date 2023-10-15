import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Position{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Weather'})
    weather_id: ObjectId;

    @Prop()
    isSailing: boolean;

    @Prop()
    longitude: string;

    @Prop()
    latitude: string;

    @Prop()
    timestamp: Date;

    @Prop()
    accuracy: number;

    @Prop()
    altitude: number;

    @Prop()
    heading: string;

    @Prop()
    speed: number;

    @Prop()
    speed_accuracy: number;

    @Prop()
    sea_depth: number;

}

export const PositionSchema = SchemaFactory.createForClass(Position);