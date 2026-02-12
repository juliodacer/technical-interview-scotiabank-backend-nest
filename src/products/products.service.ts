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
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GetProductQueryDto } from './dto/get-product.dto';
import {
  normalizeText,
  normalizeColumn,
} from 'src/commons/utils/text-normalizer.util';

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
    const { page = 1, size = 5, category, state, q } = query;

    const normalizedSize = Math.max(1, Math.min(size, 100));
    const normalizedPage = Math.max(1, page);

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.id', 'DESC')
      .skip((normalizedPage - 1) * normalizedSize)
      .take(normalizedSize);

    this.applySearchFilter(queryBuilder, q);
    this.applyCategoryFilter(queryBuilder, category);
    this.applyStateFilter(queryBuilder, state);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products: products.map((product) => {
        const { mod_date, reg_date, ...productData } = product;
        return {
          ...productData,
          category: product.category.name,
        };
      }),
      total,
      page: normalizedPage,
    };
  }

  private applySearchFilter(
    queryBuilder: SelectQueryBuilder<Product>,
    searchTerm?: string,
  ): void {
    if (!searchTerm) return;

    const normalizedSearch = normalizeText(searchTerm);
    queryBuilder.andWhere(`${normalizeColumn('product.name')} LIKE :search`, {
      search: `%${normalizedSearch}%`,
    });
  }

  private applyCategoryFilter(
    queryBuilder: SelectQueryBuilder<Product>,
    category?: string,
  ): void {
    if (!category) return;

    const normalizedCategory = normalizeText(category);
    queryBuilder.andWhere(
      `${normalizeColumn('category.name')} LIKE :categoryName`,
      {
        categoryName: `%${normalizedCategory}%`,
      },
    );
  }

  private applyStateFilter(
    queryBuilder: SelectQueryBuilder<Product>,
    state?: string,
  ): void {
    if (state === undefined || state === null) return;

    queryBuilder.andWhere('product.state = :state', {
      state: state === 'true',
    });
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const { categoryId, ...productData } = updateProductDto;
    Object.assign(product, productData);

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new NotFoundException('La categoría no existe');
      }
      product.category = category;
    }

    product.mod_date = new Date();

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return await this.productRepository.remove(product);
  }
}
