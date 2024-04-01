import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUserDto, authUserSchema } from "./dto/auth.dto";
import { ZodValidationPipe } from "src/utils/zodValidationPipe";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ZodValidationPipe(authUserSchema))
    @Post('signin')
    async signIn(@Body() authUserDto: AuthUserDto) {
        return this.authService.signIn(authUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(authUserSchema))
    @Post('login')
    async login(@Body() authUserDto: AuthUserDto) {
        return this.authService.login(authUserDto);
    }
}