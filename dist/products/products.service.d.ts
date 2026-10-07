import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { SearchProductDto } from './dto/search-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './product.entity.js';
export declare class ProductsService {
    private readonly repo;
    constructor(repo: Repository<Product>);
    create(dto: CreateProductDto): Promise<Product>;
    search(query: SearchProductDto): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<Product>;
    update(id: number, dto: UpdateProductDto): Promise<Product & UpdateProductDto>;
    remove(id: number): Promise<void>;
}
