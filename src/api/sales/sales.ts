import type { CreateSalePayload, SaleDetail, SaleListItem, SalesListParams } from "../interfaces/sale";
import { plubClient } from "../client/client";
import type { PaginatedResult } from "../interfaces/pagination";

export const salesApi = {
  async getAll(params?: SalesListParams): Promise<PaginatedResult<SaleListItem>> {
    return plubClient.get<PaginatedResult<SaleListItem>>("/sales", { params }).then((res) => res.data);
  },

  async create(payload: CreateSalePayload): Promise<SaleDetail> {
    return plubClient.post<SaleDetail>("/sales", payload).then((res) => res.data);
  },
};
