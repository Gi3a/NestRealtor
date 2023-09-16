import { ApiProperty } from "@nestjs/swagger";
import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";


export class HomeResponseDto {

    // For exclude and expose
    constructor(partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial);
    }


    @ApiProperty()
    id: number;

    @ApiProperty()
    address: string;


    // except
    @Exclude()
    number_of_bedrooms: number;

    @Expose({ name: 'numberOfBedrooms' })
    numberOfBedrooms() {
        return this.number_of_bedrooms
    }

    @Exclude()
    number_of_bathrooms: number;

    @Expose({ name: 'numberOfBathrooms' })
    numberOfBathrooms() {
        return this.number_of_bathrooms;
    }


    @ApiProperty()
    city: string;


    @Exclude()
    listed_date: Date;

    @Expose({ name: 'listedDate' })
    listedDate() {
        return this.listed_date;
    }

    @ApiProperty()
    price: number;

    // for dto transform with image
    @ApiProperty()
    image: string;


    @Exclude()
    land_size: number;

    @Expose({ name: 'landSize' })
    landSize() {
        return this.land_size;
    }

    @ApiProperty()
    propertyType: PropertyType;


    @Exclude()
    create_at: Date;

    @Exclude()
    updated_at: Date;

    @Exclude()
    realtor_id: number;
}

class Image {
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class CreateHomeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty()
    numberOfBedrooms: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty()
    numberOfBathrooms: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    city: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty()
    price: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty()
    landSize: number;

    @IsEnum(PropertyType)
    @ApiProperty()
    propertyType: PropertyType;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Image)
    @ApiProperty()
    images: Image[];
}


export class UpdateHomeDto {

    // optional ?

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    numberOfBedrooms?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    numberOfBathrooms?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    city?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    price?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    landSize?: number;

    @IsOptional()
    @IsEnum(PropertyType)
    @ApiProperty()
    propertyType?: PropertyType;

}