import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

// for filters
interface GetHomeParam {
    city?: string;
    price?: {
        gte?: number,
        lte?: number
    },
    propertyType?: PropertyType
};

// 
interface CreateHomeParams {
    address: string;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    city: string;
    price: number;
    landSize: number;
    propertyType: PropertyType;
    // array of objects instead Image
    images: { url: string }[];
}

interface UpdateHomeParams {
    address?: string;
    numberOfBedrooms?: number;
    numberOfBathrooms?: number;
    city?: string;
    price?: number;
    landSize?: number;
    propertyType?: PropertyType;
}



// which data we will grab from the db
const homeSelect = {
    id: true,
    address: true,
    city: true,
    price: true,
    propertyType: true,
    number_of_bedrooms: true,
    number_of_bathrooms: true,
}

@Injectable()
export class HomeService {

    constructor(private readonly prismaService: PrismaService) { }

    async getHomes(filters: GetHomeParam): Promise<HomeResponseDto[]> {
        // want to include images from another table
        const homes = await this.prismaService.home.findMany({
            select: {
                ...homeSelect,
                images: {
                    select: {
                        url: true
                    },
                    take: 1
                }
            },
            where: filters,

        });
        if (!homes.length) {
            throw new NotFoundException();
        }
        // for DTO transform
        // instead home {id: 1, images: {url: 1}} => {id: 1, images: url1}
        return homes.map((home) => {
            const fetchHome = { ...home, image: home.images[0].url }
            delete fetchHome.images
            return new HomeResponseDto(fetchHome)
        },
        );
    }

    async getHomeById(id) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            },
            select: {
                ...homeSelect,
                images: {
                    select: {
                        url: true
                    }
                },
                realtor: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }

        });

        if (!home) {
            throw new NotFoundException();
        }

        return new HomeResponseDto(home);
    }

    async createHome(
        { address, numberOfBathrooms, numberOfBedrooms, city, landSize, price, propertyType, images }: CreateHomeParams,
        userId: number
    ) {
        const home = await this.prismaService.home.create({
            data: {
                address,
                number_of_bathrooms: numberOfBathrooms,
                number_of_bedrooms: numberOfBedrooms,
                city,
                land_size: landSize,
                propertyType,
                price,
                realtor_id: userId
            }
        });


        // callback function to rewrite array
        const homeImages = images.map((image) => {
            return { ...image, home_id: home.id };
        });


        // awaiting for id from home creation
        await this.prismaService.image.createMany({
            data: homeImages
        });

        return new HomeResponseDto(home);
    }

    async updateHomyById(
        id: number,
        data: UpdateHomeParams
    ) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            },
        });

        if (!home) {
            throw new NotFoundException();
        }

        const updatedHome = await this.prismaService.home.update({
            where: {
                id
            },
            data
        })

        return new HomeResponseDto(updatedHome);
    }

    async deleteHomeById(id: number) {
        // foreig key внешный ключ связан с images
        await this.prismaService.image.deleteMany({
            where: {
                home_id: id
            },
        });
        await this.prismaService.home.delete({
            where: {
                id,
            }
        })
    }

    async getRealtorByHomeId(id: number) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            },
            select: {
                realtor: {
                    select: {
                        name: true,
                        id: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })

        if (!home) {
            throw new NotFoundException();
        }

        return home.realtor;
    }
}
