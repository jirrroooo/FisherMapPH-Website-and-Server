import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class EmergencyContact{
    @Prop()
    region: string;

    @Prop()
    province: string;

    @Prop()
    municipality: string;

    @Prop()
    name: string;

    @Prop()
    email_address: string;

    @Prop()
    contact_number: number;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);