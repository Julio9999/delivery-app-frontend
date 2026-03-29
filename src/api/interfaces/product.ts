import type { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  stock: number;
  category?: Category;
}

export type ProductCreate = Omit<Product, 'id' | 'category'> & { categoryId?: string };
export type ProductUpdate = Partial<ProductCreate>;
