import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponseType } from './types/userResponse.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });

    if (user) {
      throw new HttpException('User already exists', 409);
    }

    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async validateUser({ email, password }: LoginUserDto) {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      return null;
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      throw new HttpException('Invalid credentials', 401);
    }

    return user;
  }

  buildUserResponse(user: User): UserResponseType {
    return {
      name: user.name,
      email: user.email,
      access_token: this.generateToken(user),
    };
  }

  generateToken(user: User): string {
    return this.jwtService.sign({ email: user.email });
  }

  async getUser(email: string) {
    return this.userModel.findOne({ email });
  }
}
