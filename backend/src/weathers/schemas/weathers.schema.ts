import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Weather{

    @Prop()
    headline: string;

    @Prop()
    msg_type: string;

    @Prop()
    severity: string;

    @Prop()
    urgency: string;

    @Prop()
    areas: [string];

    @Prop()
    category: string;

    @Prop()
    event: string;

    @Prop()
    effective: Date;

    @Prop()
    expires: Date;

    @Prop()
    description: string;

    @Prop()
    instruction: string;

}

export const WeatherSchema = SchemaFactory.createForClass(Weather);