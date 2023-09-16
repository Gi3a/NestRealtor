import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    ParseEnumPipe,
    Param,
    ParseIntPipe,
    Body,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Home')
@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService) { }

    // promise due to dto transform
    // get param for filters
    @Get('')
    getHomes(
        @Query('city') city?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('propertyType', new ParseEnumPipe(PropertyType)) propertyType?: PropertyType,
    ): Promise<HomeResponseDto[]> {

        // distrcuted all the prices
        const price = minPrice || maxPrice ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
        } : undefined;

        // distructed to object, if defined => distruct the content
        const filters = {
            ...(city && { city }),
            ...(price && { price }),
            ...(propertyType && { propertyType })
        }
        return this.homeService.getHomes(filters);
    }

    @Get(':id')
    getHome(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.homeService.getHomeById(id);
    }


    @Roles(UserType.REALTOR, UserType.ADMIN)
    @Post('')
    createHome(
        @Body() body: CreateHomeDto,
        @User() user: UserInfo
    ) {
        return this.homeService.createHome(body, user.id);
    }


    @Roles(UserType.REALTOR, UserType.ADMIN)
    // @UseGuards(AuthGuard)
    @Put(':id')
    async updateHome(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateHomeDto,
        @User() user: UserInfo

    ) {
        const realtor = await this.homeService.getRealtorByHomeId(id);

        if (realtor.id != user.id) {
            throw new UnauthorizedException();
        }

        return this.homeService.updateHomyById(id, body);
    }


    @Roles(UserType.REALTOR, UserType.ADMIN)
    @Delete(':id')
    async deleteHome(
        @Param("id", ParseIntPipe) id: number,
        @User() user: UserInfo
    ) {
        const realtor = await this.homeService.getRealtorByHomeId(id);

        if (realtor.id != user.id) {
            throw new UnauthorizedException();
        }

        return this.homeService.deleteHomeById(id);
    }

}
