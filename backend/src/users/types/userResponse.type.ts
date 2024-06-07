import { User } from '../schemas/user.schema';

export type UserResponseType = Omit<User, 'password'> & {
  access_token: string;
};
