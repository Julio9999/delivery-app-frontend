import type { PaginatedResult, PaginationParams } from "../interfaces/pagination";
import { plubClient } from "../client/client";

export type CategorySearchItem = { id: string; label: string };
export type ProductSearchItem = { id: string; label: string };

export const searchApi = {
    
    async searchCategories(params: PaginationParams): Promise<PaginatedResult<CategorySearchItem>> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value == null) return;
            queryParams.append(key, String(value));
        });

        const url = `/categories/search?${queryParams.toString()}`;
        return plubClient.get<PaginatedResult<CategorySearchItem>>(url).then((res) => res.data);
    },

    async searchProducts(params: PaginationParams): Promise<PaginatedResult<ProductSearchItem>> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value == null) return;
            queryParams.append(key, String(value));
        });

        const url = `/products/search?${queryParams.toString()}`;
        return plubClient.get<PaginatedResult<ProductSearchItem>>(url).then((res) => res.data);
    },
};
