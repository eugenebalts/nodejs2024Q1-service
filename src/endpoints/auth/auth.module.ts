import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [UserModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
      }),
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        signOptions: { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME },
        publicKey: 'refresh'
      }),
    
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}