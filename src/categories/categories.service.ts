import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(payload: CreateCategoryDto) {
    const result = await this.categoryRepository.save(payload);

    return result;
  }

  async findAll() {
    const data = await this.categoryRepository.find();

    return data;
  }

  async findOne(id: string) {
    const result = await this.categoryRepository.findOneBy({ id });

    if (!result) throw new NotFoundException('Category not found');

    return result;
  }

  async update(id: string, payload: UpdateCategoryDto) {
    const category = await this.findOne(id);

    Object.assign(category, payload);

    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const result = await this.categoryRepository.delete(id);

    if (result.affected == 0) throw new NotFoundException('Category not found');

    return {};
  }
}
