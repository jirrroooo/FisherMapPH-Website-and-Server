import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class User{

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop()
    sex: string;

    @Prop({unique: [true, "Duplicate email entered"]})
    email_address: string;

    @Prop()
    password: string;

    @Prop()
    contact_number: string;

    @Prop()
    address: string;

    @Prop()
    region: string;

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
    person_to_notify: Array<object>;

    @Prop()
    fishing_vessel_type: string;

}

export const UserSchema = SchemaFactory.createForClass(User);