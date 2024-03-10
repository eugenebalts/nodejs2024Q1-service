import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PublicUser, User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID, ERROR_USER_ALREADY_EXISTS } from 'src/constants';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private database: DataBaseService) {}

  getPublicUserData(user: User): PublicUser {
    const { password, ...publicUserData } = user;

    return publicUserData;
  }

  getAllUsers(): PublicUser[] {
    return Object.values(this.database.users).map((user) =>
      this.getPublicUserData(user),
    );
  }

  getUser(id: string): PublicUser {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const user = this.database.users[id];

    if (!user) {
      throw new NotFoundException();
    }

    return this.getPublicUserData(user);
  }

  createUser(createUserDto: CreateUserDto): PublicUser {
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

    this.database.users[id] = newUser;

    return this.getPublicUserData(newUser);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): PublicUser {
    this.getUser(id);

    const user = this.database.users[id];

    const { newPassword, oldPassword } = updatePasswordDto;

    if (oldPassword !== user.password) {
      throw new ForbiddenException('Wrong password');
    }

    const updatedUser = {
      ...user,
      password: newPassword,
      updatedAt: new Date().getTime(),
      version: user.version + 1,
    };

    this.database.users[id] = updatedUser;

    return this.getPublicUserData(updatedUser);
  }

  deleteUser(id: string): void {
    this.getUser(id);

    delete this.database.users[id];
  }
}
