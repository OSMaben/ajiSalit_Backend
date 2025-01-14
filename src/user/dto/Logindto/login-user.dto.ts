import { IsNotEmpty, IsString, Matches,IsEnum } from "class-validator";

export class LoginUserDto {

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g., +212697042868)'
    })
    phoneNumber: string;


}
