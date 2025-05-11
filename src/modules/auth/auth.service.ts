import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(payload: LoginDto) {
    // Find user with email
    const userIsExisting = await this.userService.findByEmail(payload.email);

    if (!userIsExisting) throw new ConflictException('Credentials not valid');

    // if user exists, compare password
    const passwordIsValid = await userIsExisting.validatePassword(
      payload.password,
    );

    if (!passwordIsValid) throw new ConflictException('Credentials not valid');

    const jwtPayload = {
      email: userIsExisting.email,
      sub: userIsExisting.id,
    };

    const accessToken = this.jwtService.sign(jwtPayload);

    return { ...instanceToPlain(userIsExisting), accessToken };
  }

  async register(payload: RegisterDto) {
    const user = await this.userService.create(payload);

    return user;
  }
}
