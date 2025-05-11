import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/modules/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly categoriesService: CategoriesService,
  ) {}

  async create(payload: CreateProductDto) {
    // this will throw an error if category_id not exists
    await this.categoriesService.findOne(payload.category_id);

    const result = await this.productRepository.save(payload);

    return result;
  }

  async findAll() {
    const data = await this.productRepository.find();

    return data;
  }

  async findOne(id: string) {
    const result = await this.productRepository.findOneBy({ id });

    if (!result) throw new NotFoundException('Product not found');

    return result;
  }

  async update(id: string, payload: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, payload);

    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);

    if (result.affected == 0) throw new NotFoundException('Product not found');

    return {};
  }
}
