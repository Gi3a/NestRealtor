import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client'

interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

interface SigninParams {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) {

    }

    async signup(
        { email, password, name, phone }: SignupParams,
        userType: UserType
    ) {

        // checking the same user with same email
        const userExsist = await this.prismaService.user.findUnique({
            where: {
                email
            },
        });
        if (userExsist) {
            throw new ConflictException();
        }

        // hash password, 10 - salt
        const hashedPassword = await bcrypt.hash(password, 10);

        // save to db
        const user = await this.prismaService.user.create({
            data: {
                email,
                phone,
                name,
                password: hashedPassword,
                user_type: userType
            },
        });

        // generate jwtoken
        return this.generateJWT(name, user.id);
    }


    async signin({ email, password }: SigninParams) {
        // find the user by email
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if (!user)
            throw new HttpException('Invalid credentials', 400);

        // validate hasdhed password
        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword)
            throw new HttpException('Invalid credentials', 400);

        // return jwt
        return this.generateJWT(user.name, user.id);
    }

    private generateJWT(name: string, id: number) {
        return jwt.sign(
            {
                name,
                id,
            },
            process.env.JSON_TOKEN_KEY,
            {
                expiresIn: 36000
            }
        );
    }

    generateProductKey(email: string, userType: UserType) {
        const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

        // 10 - salt
        return bcrypt.hash(string, 10);
    }

}
