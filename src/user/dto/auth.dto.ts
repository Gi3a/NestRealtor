import { UserType } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

// for validation form
export class SignupDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "phone must be a valid phone number" })
    @ApiProperty()
    phone: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(5)
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productKey?: string;
}

export class SigninDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    password: string;
}

export class GenerateProductKeyDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsEnum(UserType)
    @ApiProperty()
    userType: UserType
}