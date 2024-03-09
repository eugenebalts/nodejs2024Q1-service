import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { isValidUuid } from 'src/utils/isValidUuid';
import { Response } from 'express';
import {
  ERROR_INVALID_ID,
  ERROR_NOT_FOUND,
  ERROR_USER_ALREADY_EXISTS,
} from 'src/constants';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string, @Res() res: Response) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const user = this.userService.getUser(id);

    if (!user) {
      throw new HttpException(ERROR_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).send(user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = this.userService.createUser(createUserDto);

    if (!user) {
      throw new ConflictException(ERROR_USER_ALREADY_EXISTS);
    }

    res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      response: user,
    });
  }
}
