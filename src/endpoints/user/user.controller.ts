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
  UseGuards,
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
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.getUser(id, 'public');

    res.status(HttpStatus.OK).send(user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(createUserDto);

    res.status(HttpStatus.CREATED).send(user);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePasswordSchema))
    updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const updatedUser = await this.userService.updatePassword(
      id,
      updatePasswordDto,
    );

    res.status(HttpStatus.OK).send(updatedUser);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.userService.deleteUser(id);

    res.status(HttpStatus.NO_CONTENT).send(true);
  }
}
