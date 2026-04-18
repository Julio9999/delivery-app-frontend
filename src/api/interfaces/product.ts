import type { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  currentPrice?: number;
  isOnOffer?: boolean;
  offerPrice?: number | null;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
  stock: number;
  category?: Category;
}

export interface ProductCreate {
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  stock: number;
  categoryId?: string;
}

export type ProductUpdate = Partial<ProductCreate>;
