import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { isValidUuid } from 'src/utils/isValidUuid';
import {
  ERROR_INVALID_ID,
} from '../../constants';
import { Repository } from 'typeorm';
import { User, PublicUser } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getPublicUserData(user: User): PublicUser {
    const { id, login, version, createdAt, updatedAt } = user;

    const publicUserData: PublicUser = {
      id,
      login,
      version,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };

    return publicUserData;
  }

  async getAllUsers(): Promise<PublicUser[]> {
    const allUsers = await this.userRepository.find();

    return allUsers.map((user) => this.getPublicUserData(user));
  }

  async getUser<T extends 'private' | 'public'>(
    id: string,
    mode: T,
  ): Promise<T extends 'private' ? User : PublicUser> {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return mode === 'private'
      ? user
      : (this.getPublicUserData(user) as T extends 'private'
          ? User
          : PublicUser);
  }

  async findUser(login: string): Promise<User | null> {
    return await this.userRepository.findOneBy({login});
  }

  async createUser(createUserDto: CreateUserDto): Promise<PublicUser> {
    const { login, password } = createUserDto;
    const CRYPTO_SALT = Number(process.env.CRYPT_SALT ?? 10);
    const hashedPassword = await bcrypt.hash(password, CRYPTO_SALT);

    const registeredUser = await this.userRepository.findOneBy({ login });

    if (registeredUser) {
      throw new ConflictException('User with this login already exists');
    }

    const timestamp = new Date().getTime();
    const id = uuidv4();

    const newUser: User = {
      id,
      login,
      password: hashedPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1,
    };

    try {
      await this.userRepository.save(newUser);

      return this.getPublicUserData(newUser);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<PublicUser> {
    const user = await this.getUser(id, 'private');

    const { newPassword, oldPassword } = updatePasswordDto;

    if (oldPassword !== user.password) {
      throw new ForbiddenException('Wrong password');
    }

    const timestamp = new Date().getTime();

    const updatedUser: User = {
      ...user,
      password: newPassword,
      updatedAt: timestamp,
      version: user.version + 1,
    };

    try {
      const user = await this.userRepository.save(updatedUser);

      return this.getPublicUserData(user);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUser(id, 'public');

    try {
      await this.userRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
