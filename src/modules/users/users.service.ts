import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(payload: CreateUserDto) {
    const userIsExisting = await this.findByEmail(payload.email);

    if (userIsExisting) throw new ConflictException('User already exists');

    const user = this.userRepository.create(payload);
    return instanceToPlain(this.userRepository.save(user));
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
