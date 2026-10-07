import { CreateProductDto } from './dto/create-product.dto.js';
import { SearchProductDto } from './dto/search-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductsService } from './products.service.js';
export declare class ProductsController {
    private readonly products;
    constructor(products: ProductsService);
    create(dto: CreateProductDto): Promise<import("./product.entity.js").Product>;
    search(query: SearchProductDto): Promise<{
        data: import("./product.entity.js").Product[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<import("./product.entity.js").Product>;
    update(id: number, dto: UpdateProductDto): Promise<import("./product.entity.js").Product & UpdateProductDto>;
    remove(id: number): Promise<void>;
}
