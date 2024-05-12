import { IsNotEmpty,} from "class-validator";
import { ObjectId } from "mongoose";

export class AlertLogDto {
    @IsNotEmpty()
    user_id: ObjectId;

    @IsNotEmpty()
    alert_id: ObjectId;
}
