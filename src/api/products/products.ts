import type {
  Product,
  ProductCreate,
  ProductUpdate,
} from "../interfaces/product";
import { plubClient } from "../client/client";

export const productsApi = {
  async getAll(): Promise<Product[]> {
    return plubClient.get<Product[]>("/products").then((res) => res.data);
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

  async updateStock(id: string, quantity: number): Promise<Product> {
    return plubClient
      .patch<Product>(`/products/${id}/stock`, { quantity })
      .then((res) => res.data);
  },

  async remove(id: string): Promise<void> {
    return plubClient.delete(`/products/${id}`).then(() => undefined);
  },
};
