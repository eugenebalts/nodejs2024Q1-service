import { ForbiddenException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthUserDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { PublicUser } from "../user/models/user.entity";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async signIn(authUserDto: AuthUserDto): Promise<PublicUser> {
        return await this.userService.createUser(authUserDto);
    }

    async login(authUserDto: AuthUserDto): Promise<{ access_token: string }>{
        const {login, password} = authUserDto; 

        const user = await this.userService.findUser(login);

        if (!user || user?.password !== password) {
            throw new ForbiddenException('You have entered an invalid login or password');
        }

        const payload = { sub: user.id, login: user.login };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
          
    }
}