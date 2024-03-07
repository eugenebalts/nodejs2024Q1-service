import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getAllUsers() {
    return 'all users';
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return `user by id ${id}`;
  }
}
