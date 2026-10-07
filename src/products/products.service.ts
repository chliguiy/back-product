import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { SearchProductDto } from './dto/search-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async search(query: SearchProductDto) {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const qb = this.repo.createQueryBuilder('p');
    if (q) {
      qb.andWhere('(p.name LIKE :q OR p.description LIKE :q)', {
        q: `%${q}%`,
      });
    }
    if (category) qb.andWhere('p.category = :category', { category });
    if (minPrice !== undefined) qb.andWhere('p.price >= :minPrice', { minPrice });
    if (maxPrice !== undefined) qb.andWhere('p.price <= :maxPrice', { maxPrice });

    const [data, total] = await qb
      .orderBy(`p.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    return this.repo.save(Object.assign(product, dto));
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
  }
}
