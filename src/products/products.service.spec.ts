import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let ds: DataSource;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [ProductsService],
    }).compile();
    service = mod.get(ProductsService);
    ds = mod.get(DataSource);

    await service.create({ name: 'Clavier', description: 'RGB', price: 90, category: 'info' });
    await service.create({ name: 'Souris', price: 25, category: 'info' });
    await service.create({ name: 'Chaise', price: 150, category: 'maison' });
  });

  afterEach(() => ds.destroy());

  it('creates a product with defaults', async () => {
    const p = await service.create({ name: 'Stylo', price: 2 });
    expect(p).toMatchObject({ name: 'Stylo', price: 2, stock: 0 });
    expect(p.id).toBeDefined();
  });

  it('findOne returns a product or throws NotFound', async () => {
    expect((await service.findOne(1)).name).toBe('Clavier');
    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates only the given fields', async () => {
    const p = await service.update(1, { price: 70 });
    expect(p).toMatchObject({ name: 'Clavier', price: 70 });
    await expect(service.update(999, { price: 1 })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes a product', async () => {
    await service.remove(2);
    await expect(service.findOne(2)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove(2)).rejects.toBeInstanceOf(NotFoundException);
  });

  describe('search', () => {
    it('returns everything with pagination info', async () => {
      const r = await service.search({});
      expect(r).toMatchObject({ total: 3, page: 1, limit: 10, pages: 1 });
    });

    it('matches q on name and description', async () => {
      expect((await service.search({ q: 'clav' })).data.map((p) => p.name)).toEqual(['Clavier']);
      expect((await service.search({ q: 'rgb' })).total).toBe(1);
    });

    it('filters by category and price range', async () => {
      expect((await service.search({ category: 'info' })).total).toBe(2);
      const r = await service.search({ minPrice: 30, maxPrice: 100 });
      expect(r.data.map((p) => p.name)).toEqual(['Clavier']);
    });

    it('sorts and paginates', async () => {
      const r = await service.search({ sortBy: 'price', order: 'ASC', limit: 2, page: 2 });
      expect(r.data.map((p) => p.name)).toEqual(['Chaise']);
      expect(r).toMatchObject({ total: 3, pages: 2 });
    });
  });
});
