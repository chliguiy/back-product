import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'products.db',
      autoLoadEntities: true,
      synchronize: true, // dev uniquement
    }),
    ProductsModule,
  ],
})
export class AppModule {}
