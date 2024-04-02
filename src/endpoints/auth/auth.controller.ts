import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUserDto, authUserSchema } from "./dto/auth.dto";
import { ZodValidationPipe } from "src/utils/zodValidationPipe";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ZodValidationPipe(authUserSchema))
    @Post('signup')
    async signUp(@Body() authUserDto: AuthUserDto) {
        return this.authService.signUp(authUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(authUserSchema))
    @Post('login')
    async login(@Body() authUserDto: AuthUserDto) {
        return this.authService.login(authUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refresh(refreshTokenDto);
    }


}