import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmergencyContactDto {

    @IsNotEmpty()
    @IsString()
    region: string;

    @IsNotEmpty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @IsString()
    municipality: string;

    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email_address: string;

    @IsNotEmpty()
    @IsNumber()
    contact_number: number;
}
