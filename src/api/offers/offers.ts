import type { Offer, OfferCreate, OfferUpdate } from '../interfaces/offer';
import { plubClient } from '../client/client';
import type { PaginatedResult, PaginationParams } from '../interfaces/pagination';

export interface OfferListParams extends PaginationParams {
  isOnOffer?: boolean;
}

export const offersApi = {
  async getAll(params?: OfferListParams): Promise<PaginatedResult<Offer>> {
    return plubClient
      .get<PaginatedResult<Offer>>('/offers', { params })
      .then((res) => res.data);
  },

  async getById(id: string): Promise<Offer> {
    return plubClient.get<Offer>(`/offers/${id}`).then((res) => res.data);
  },

  async create(data: OfferCreate): Promise<Offer> {
    return plubClient.post<Offer>('/offers', data).then((res) => res.data);
  },

  async update(id: string, data: OfferUpdate): Promise<Offer> {
    return plubClient
      .patch<Offer>(`/offers/${id}`, data)
      .then((res) => res.data);
  },

  async remove(id: string): Promise<void> {
    return plubClient.delete(`/offers/${id}`).then(() => undefined);
  },
};
