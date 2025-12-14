import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    businessId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    phone?: string;
    
    @IsOptional()
    @IsString()
    email?: string;
}
