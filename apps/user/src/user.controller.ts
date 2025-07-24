import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    delete registerUser.captcha;
    return this.userService.create(registerUser);
  }
}
