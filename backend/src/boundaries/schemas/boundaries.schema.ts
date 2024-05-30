import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Boundary{

    @Prop()
    title: string;

    @Prop()
    region: string;

    @Prop()
    province: string;

    @Prop()
    municipality: string;

    @Prop()
    postal_code: number;

    @Prop()
    location: [];

}

export const BoundarySchema = SchemaFactory.createForClass(Boundary);