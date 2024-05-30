import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class DeleteContactDto {
    @IsNotEmpty()
    user_id: ObjectId;

    @IsNotEmpty()
    contact_id: ObjectId;
}
