import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBoundaryDto {

    @IsNotEmpty()
    @IsString()
    title: string;

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
    @IsNumber()
    postal_code: number;

    @IsNotEmpty()
    location: [];
}
