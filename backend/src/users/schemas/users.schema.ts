import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class User{

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop({unique: [true, "Duplicate email entered"]})
    email_address: string;

    @Prop()
    password: string;

    @Prop()
    profile_picture: string;

    @Prop()
    contact_number: string;

    @Prop()
    address: string;

    @Prop()
    birthday: Date;

    @Prop()
    civil_status: string;

    @Prop()
    user_type: string;

    @Prop()
    isAuthenticated: boolean;

    @Prop()
    membership_date: Date;

    @Prop()
    person_to_notify: string;

    @Prop()
    fishing_vessel_type: string;

}

export const UserSchema = SchemaFactory.createForClass(User);