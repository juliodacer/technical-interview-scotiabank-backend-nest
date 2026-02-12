import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { code, categoryId, ...productData } = createProductDto;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }
    const existingProduct = await this.productRepository.findOneBy({
      code,
    });

    if (existingProduct) {
      throw new BadRequestException('El código ya está en uso');
    }

    const savedProduct = await this.productRepository.save({
      ...productData,
      code,
      category,
    });

    return {
      ...savedProduct,
      category: category.name,
    };
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
