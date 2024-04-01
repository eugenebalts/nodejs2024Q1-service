import { ForbiddenException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthUserDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { PublicUser } from "../user/models/user.entity";
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async signUp(authUserDto: AuthUserDto): Promise<PublicUser> {
        return await this.userService.createUser(authUserDto);
    }

    async login(authUserDto: AuthUserDto): Promise<{ access_token: string }>{
        const {login, password} = authUserDto; 

        const user = await this.userService.findUser(login);

        if (!user || user?.password !== password) {
            throw new ForbiddenException('You have entered an invalid login or password');
        }

        const secretKey = process.env.JWT_SECRET_KEY || 'secret123123';

        const payload = { userId: user.id, login: user.login, secretKey };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
          
    }
}