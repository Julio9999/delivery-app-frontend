import type {
  Product,
  ProductCreate,
  ProductUpdate,
} from "../interfaces/product";
import { plubClient } from "../client/client";
import type { PaginatedResult, PaginationParams } from "../interfaces/pagination";

export const productsApi = {
  async getAll(params?: PaginationParams): Promise<PaginatedResult<Product>> {
    return plubClient.get<PaginatedResult<Product>>("/products", { params }).then((res) => res.data);
  },

  async getById(id: string): Promise<Product> {
    return plubClient.get<Product>(`/products/${id}`).then((res) => res.data);
  },

  async create(data: ProductCreate): Promise<Product> {
    return plubClient.post<Product>("/products", data).then((res) => res.data);
  },

  async update(id: string, data: ProductUpdate): Promise<Product> {
    return plubClient
      .patch<Product>(`/products/${id}`, data)
      .then((res) => res.data);
  },

  async uploadImage(id: string, file: File): Promise<Product> {
    const formData = new FormData();
    formData.append('file', file);

    return plubClient
      .post<Product>(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);
  },

  async updateStock(id: string, quantity: number): Promise<Product> {
    return plubClient
      .patch<Product>(`/products/${id}/stock`, { quantity })
      .then((res) => res.data);
  },

  async remove(id: string): Promise<void> {
    return plubClient.delete(`/products/${id}`).then(() => undefined);
  },
};
