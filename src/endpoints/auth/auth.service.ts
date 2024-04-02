import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthUserDto } from './dto/auth.dto';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { PublicUser, User } from '../user/models/user.entity';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

const aboba: JwtVerifyOptions = {};

aboba.publicKey;

dotenv.config();

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  private tokenPairs: Record<string, TokenPair>;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenPairs = {};
  }

  async signUp(authUserDto: AuthUserDto): Promise<PublicUser> {
    return await this.userService.createUser(authUserDto);
  }

  async login(authUserDto: AuthUserDto): Promise<TokenPair> {
    const { login, password } = authUserDto;

    const user = await this.userService.findUser(login);

    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isMatch) {
      throw new ForbiddenException(
        'You have entered an invalid login or password',
      );
    }

    await this.removeTokenPair(user.id);

    return await this.generateTokens(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    if (
      !('refreshToken' in refreshTokenDto) ||
      typeof refreshTokenDto.refreshToken !== 'string'
    ) {
      throw new UnauthorizedException('Bad request body');
    }

    try {
      const { refreshToken } = refreshTokenDto;

      const decodedToken = await this.jwtService
        .verifyAsync(refreshToken, {
          jwtid: 'refresh',
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        })
        .catch(() => {
          throw new Error('Refresh token is invalid');
        });
      const login = decodedToken['login'];
      const user = await this.userService.findUser(login);

      if (!user) {
        throw new Error('Refresh token is invalid');
      }

      const isTokenValid = await this.isTokenValid(user.id, refreshToken);

      if (!isTokenValid) {
        throw new Error('Refresh token is expired');
      }

      await this.removeTokenPair(user.id);

      return await this.generateTokens(user);
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const accessTokenPayload = {
      userId: user.id,
      login: user.login,
      secretKey: process.env.JWT_SECRET_KEY,
    };
    const refreshTokenPayload = { login: user.login };

    const tokenPair: TokenPair = {
      accessToken: await this.jwtService.signAsync(accessTokenPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, {
        jwtid: 'refresh',
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };

    await this.storeTokenPair(user.id, tokenPair);

    return tokenPair;
  }

  private async storeTokenPair(userId: string, tokenPair: TokenPair) {
    this.tokenPairs[userId] = tokenPair;
  }

  private async removeTokenPair(userId: string) {
    delete this.tokenPairs[userId];
  }

  private async isTokenValid(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    return (
      userId in this.tokenPairs &&
      this.tokenPairs[userId].refreshToken === refreshToken
    );
  }
}
