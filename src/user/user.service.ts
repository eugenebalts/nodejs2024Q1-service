import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllUsers() {
    return this.users;
  }

  getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto) {
    const isUserExists = !!this.users.find(
      (user) => user.login === createUserDto.login,
    );

    if (isUserExists) return false;

    const timestamp = new Date().getTime();

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1,
    };

    this.users.push(newUser);

    return newUser;
  }
}
