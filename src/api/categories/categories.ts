import type { Category, CategoryCreate, CategoryUpdate } from "../interfaces/category";
import { plubClient } from "../client/client";

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    return plubClient.get<Category[]>("/categories").then((res) => res.data);
  },

  async getById(id: string): Promise<Category> {
    return plubClient.get<Category>(`/categories/${id}`).then((res) => res.data);
  },

  async create(data: CategoryCreate): Promise<Category> {
    return plubClient.post<Category>("/categories", data).then((res) => res.data);
  },

  async update(id: string, data: CategoryUpdate): Promise<Category> {
    return plubClient
      .patch<Category>(`/categories/${id}`, data)
      .then((res) => res.data);
  },

  async remove(id: string): Promise<void> {
    return plubClient.delete(`/categories/${id}`).then(() => undefined);
  },
};