import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID, ERROR_USER_ALREADY_EXISTS } from 'src/constants';

@Injectable()
export class UserService {
  private users: Record<string, User> = {};

  getPublicUserData(user: User) {
    const publicUserData = {};

    for (const key in user) {
      if (key === 'password') continue;

      publicUserData[key] = user[key];
    }

    return publicUserData;
  }

  getAllUsers() {
    return Object.values(this.users).map((user) =>
      this.getPublicUserData(user),
    );
  }

  getUser(id: string) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const user = this.users[id];

    if (!user) {
      throw new NotFoundException();
    }

    return this.getPublicUserData(user);
  }

  createUser(createUserDto: CreateUserDto) {
    const isUserExists = !!Object.values(this.users).filter(
      (user) => user.login === createUserDto.login,
    ).length;

    if (isUserExists) {
      throw new ConflictException(ERROR_USER_ALREADY_EXISTS);
    }

    const timestamp = new Date().getTime();
    const id = uuidv4();

    const newUser: User = {
      id,
      login: createUserDto.login,
      password: createUserDto.password,
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1,
    };

    this.users[id] = newUser;

    return this.getPublicUserData(newUser);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    this.getUser(id);
    const user = this.users[id];

    const { newPassword, oldPassword } = updatePasswordDto;

    if (oldPassword !== user.password) {
      throw new ForbiddenException('Wrong password');
    }

    this.users[id].password = newPassword;
    this.users[id].updatedAt = new Date().getTime();
    this.users[id].version += 1;

    return;
  }

  deleteUser(id: string) {
    this.getUser(id);

    return delete this.users[id];
  }
}
