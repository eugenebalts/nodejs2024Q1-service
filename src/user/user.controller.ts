import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import {
  UpdatePasswordDto,
  updatePasswordSchema,
} from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string, @Res() res: Response) {
    const user = this.userService.getUser(id);

    res.status(HttpStatus.OK).send(user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = this.userService.createUser(createUserDto);

    res.status(HttpStatus.CREATED).send(user);
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePasswordSchema))
    updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const updatedUser = this.userService.updatePassword(id, updatePasswordDto);

    res.status(HttpStatus.OK).send(updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    this.userService.deleteUser(id);

    res.status(HttpStatus.NO_CONTENT).send(true);
  }
}
