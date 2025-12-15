import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCustomerDto {
    // optional cause it will be extracted from the token :)), thinking about whether to leave it here or remove it; ill decide after testing
    @IsOptional()
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
