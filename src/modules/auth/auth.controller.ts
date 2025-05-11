import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('register')
  @HttpCode(200)
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
}
