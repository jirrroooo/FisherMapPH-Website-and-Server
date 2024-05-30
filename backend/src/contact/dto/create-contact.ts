import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateContactDto {
    @IsNotEmpty()
    user_id: ObjectId;

    @IsString()
    full_name: []

    @IsString()
    email_address: string;

    @IsString()
    contact_number: string;

    @IsString()
    address: string;

}
