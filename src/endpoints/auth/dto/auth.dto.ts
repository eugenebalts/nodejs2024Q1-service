import {
  CreateUserDto,
  createUserSchema,
} from 'src/endpoints/user/dto/create-user.dto';

export const authUserSchema = createUserSchema;
export type AuthUserDto = CreateUserDto;
