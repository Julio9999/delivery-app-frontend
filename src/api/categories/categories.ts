import type { Category, CategoryCreate, CategoryUpdate } from "../interfaces/category";
import { plubClient } from "../client/client";
import type { PaginatedResult, PaginationParams } from "../interfaces/pagination";

export const categoriesApi = {
  async getAll(params?: PaginationParams): Promise<PaginatedResult<Category>> {
    return plubClient.get<PaginatedResult<Category>>("/categories", {params}).then((res) => res.data);
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

  async uploadImage(id: string, file: File): Promise<Category> {
    const formData = new FormData();
    formData.append('file', file);

    return plubClient
      .post<Category>(`/categories/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);
  },

  async remove(id: string): Promise<void> {
    return plubClient.delete(`/categories/${id}`).then(() => undefined);
  },
};