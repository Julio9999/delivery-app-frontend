export interface SaleListItem {
  id: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleDetail extends SaleListItem {
  items: SaleItem[];
}

export interface CreateSalePayload {
  items: { productId: string; quantity: number }[];
}

export interface SalesListParams {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  productId?: string;
}

export interface SalesFilters {
  from?: string;
  to?: string;
  productId?: string;
  [key: string]: unknown;
}
