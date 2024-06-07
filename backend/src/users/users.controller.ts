import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guards';
import { ExpressRequest } from './middlewares/auth.middleware';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: Request, @Body() loginUser: LoginUserDto) {
    const user = await this.usersService.validateUser(loginUser);

    return this.usersService.buildUserResponse(user);
  }

  @Get('user')
  async getUser(@Request() req: ExpressRequest) {
    if (!req.user) {
      throw new HttpException('Not authorized', 401);
    }
    return this.usersService.buildUserResponse(req.user);
  }
}
