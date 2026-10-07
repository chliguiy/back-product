import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Product } from '../src/products/product.entity.js';
import { ProductsModule } from '../src/products/products.module.js';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Product],
          synchronize: true,
        }),
        ProductsModule,
      ],
    }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('full CRUD + search flow', async () => {
    const http = app.getHttpServer();

    const created = await request(http)
      .post('/products')
      .send({ name: 'Clavier', price: 90, category: 'info' })
      .expect(201);
    const id = created.body.id;

    await request(http).post('/products').send({ name: 'Chaise', price: 150 }).expect(201);

    await request(http).get(`/products/${id}`).expect(200).expect((r) => {
      expect(r.body.name).toBe('Clavier');
    });

    await request(http).patch(`/products/${id}`).send({ price: 70 }).expect(200).expect((r) => {
      expect(r.body.price).toBe(70);
    });

    await request(http)
      .get('/products?q=clav&maxPrice=100&sortBy=price&order=ASC')
      .expect(200)
      .expect((r) => {
        expect(r.body.total).toBe(1);
        expect(r.body.data[0].id).toBe(id);
      });

    await request(http).delete(`/products/${id}`).expect(204);
    await request(http).get(`/products/${id}`).expect(404);
  });

  it('rejects invalid input', async () => {
    const http = app.getHttpServer();
    await request(http).post('/products').send({ name: '', price: -1 }).expect(400);
    await request(http).get('/products/abc').expect(400);
    await request(http).get('/products?page=0').expect(400);
  });
});
