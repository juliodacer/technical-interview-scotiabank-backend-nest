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
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { GetProductQueryDto } from './dto/get-product.dto';

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

  async findAll(query: GetProductQueryDto) {
    const { page = 1, size = 10, q, category, state } = query;

    const normalizedSize = Math.max(1, Math.min(size, 100));
    const normalizedPage = Math.max(1, page);

    const options: FindManyOptions<Product> = {
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
      take: normalizedSize,
      skip: (normalizedPage - 1) * normalizedSize,
    };

    const where: FindManyOptions<Product>['where'] = {};

    if (category) {
      where.category = { name: category };
    }

    if (state !== undefined && state !== null) {
      where.state = state === 'true';
    }

    options.where = where;

    const [products, total] =
      await this.productRepository.findAndCount(options);

    return {
      products: products.map((product) => ({
        ...product,
        category: product.category.name,
      })),
      total,
      page: normalizedPage,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return {
      ...product,
      category: product.category.name,
    };
  }
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
