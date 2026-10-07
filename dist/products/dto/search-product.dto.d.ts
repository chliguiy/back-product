export declare class SearchProductDto {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    order?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
