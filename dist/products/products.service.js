var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
let ProductsService = class ProductsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return this.repo.save(this.repo.create(dto));
    }
    async search(query) {
        const { q, category, minPrice, maxPrice, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10, } = query;
        const qb = this.repo.createQueryBuilder('p');
        if (q) {
            qb.andWhere('(p.name LIKE :q OR p.description LIKE :q)', {
                q: `%${q}%`,
            });
        }
        if (category)
            qb.andWhere('p.category = :category', { category });
        if (minPrice !== undefined)
            qb.andWhere('p.price >= :minPrice', { minPrice });
        if (maxPrice !== undefined)
            qb.andWhere('p.price <= :maxPrice', { maxPrice });
        const [data, total] = await qb
            .orderBy(`p.${sortBy}`, order)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const product = await this.repo.findOneBy({ id });
        if (!product)
            throw new NotFoundException(`Product #${id} not found`);
        return product;
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        return this.repo.save(Object.assign(product, dto));
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.repo.remove(product);
    }
};
ProductsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Product)),
    __metadata("design:paramtypes", [Repository])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map