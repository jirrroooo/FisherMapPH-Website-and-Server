import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { AnyArray, ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Contact{

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: ObjectId;

    @Prop()
    full_name: string;

    @Prop()
    email_address: string;

    @Prop()
    contact_number: string;

    @Prop()
    address: string;

}

export const ContactSchema = SchemaFactory.createForClass(Contact);