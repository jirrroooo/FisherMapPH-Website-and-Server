import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Alert{

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    location: [];

    @Prop()
    radius: number;

    @Prop()
    level: string;
    
    @Prop()
    isSpecific: boolean;

    @Prop()
    specified_user: [string];

    @Prop()
    notified_user: [string];

    @Prop()
    effective: Date;

    @Prop()
    expires: Date;

    @Prop()
    instruction: string;

}

export const AlertSchema = SchemaFactory.createForClass(Alert);