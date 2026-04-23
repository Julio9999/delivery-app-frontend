export interface OfferProductSummary {
  id: string;
  name: string;
}

export interface Offer {
  id: string;
  name?: string | null;
  discountPercentage?: number | null;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
  isOnOffer: boolean;
  productsCount: number;
  products?: OfferProductSummary[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OfferCreate {
  name?: string | null;
  discountPercentage?: number | null;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
  productIds: string[];
}

export type OfferUpdate = Partial<OfferCreate>;
