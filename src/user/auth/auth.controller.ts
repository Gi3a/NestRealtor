import { Controller, Post, Body, Param, ParseEnumPipe, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dto/auth.dto';
import { UserType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { User, UserInfo } from '../decorators/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    // added authService
    constructor(private readonly authService: AuthService) { }

    // signup, add user to db and generate a jwtoken
    @Post('/signup/:userType')
    async signup(
        @Body() body: SignupDto,
        // parse enum from string to enum
        @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
    ) {
        if (userType !== UserType.BUYER) {
            if (!body.productKey) {
                throw new UnauthorizedException();
            }

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

            if (!isValidProductKey) {
                throw new UnauthorizedException();
            }
        }

        return this.authService.signup(body, userType);
    }

    @Post('/signin')
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body);
    }

    @Post('/key')
    generateProductKey(
        @Body() { userType, email }: GenerateProductKeyDto
    ) {
        return this.authService.generateProductKey(email, userType);
    }

    @Get('/profile')
    profile(
        @User() user: UserInfo
    ) {
        return user;
    }



}