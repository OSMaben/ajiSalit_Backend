import { IsNotEmpty, IsString, Matches,IsEnum } from "class-validator";

export class CreateUserDto {


    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g., +212697042868)'
    })
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['admin', 'client', 'company']) 
    role: string;

}
