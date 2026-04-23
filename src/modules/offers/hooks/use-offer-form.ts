import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import type { DatePickerRangeValue } from '@/components/common/date-picker/date-picker';
import { useFetch } from '@/hooks/useFetch';
import { showErrorToast, showSuccessToast } from '@/lib/utils';
import { offersApi } from '@/api/offers/offers';
import type { Offer, OfferCreate, OfferUpdate } from '@/api/interfaces/offer';
import { offerSchema, type OfferForm } from '../schemas/schemas';

interface UseOfferFormOptions {
  offerId?: string;
}

const toDateTimeLocal = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const timezoneOffset = parsed.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(parsed.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
};

const toIsoStringOrNull = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
};

export const useOfferForm = (options?: UseOfferFormOptions) => {
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: '',
      discountPercentage: 0,
      offerStartsAt: '',
      offerEndsAt: '',
      products: [],
    },
  });

  const selectedProducts = form.watch('products') ?? [];
  const offerStartsAt = form.watch('offerStartsAt');
  const offerEndsAt = form.watch('offerEndsAt');

  const selectedRange = useMemo(
    () =>
      offerStartsAt || offerEndsAt
        ? {
            from: offerStartsAt || undefined,
            to: offerEndsAt || undefined,
          }
        : undefined,
    [offerStartsAt, offerEndsAt],
  );

  const goBack = () => {
    navigate('/offers');
  };

  const handleProductsChange = (items: OfferForm['products']) => {
    form.setValue('products', items, { shouldValidate: true, shouldDirty: true });
  };

  const handleRangeChange = useCallback(
    (range: DatePickerRangeValue | undefined) => {
      form.setValue('offerStartsAt', range?.from ?? '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue('offerEndsAt', range?.to ?? '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form],
  );

  const onSubmit = async (data: OfferForm) => {
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const basePayload = {
        name: data.name?.trim() ? data.name.trim() : null,
        discountPercentage: data.discountPercentage,
        offerStartsAt: toIsoStringOrNull(data.offerStartsAt),
        offerEndsAt: toIsoStringOrNull(data.offerEndsAt),
        productIds: data.products.map((product) => product.id),
      };

      if (options?.offerId) {
        const payload: OfferUpdate = basePayload;
        await offersApi.update(options.offerId, payload);
        showSuccessToast('Oferta actualizada con exito');
      } else {
        const payload: OfferCreate = basePayload;
        await offersApi.create(payload);
        form.reset({
          name: '',
          discountPercentage: 0,
          offerStartsAt: '',
          offerEndsAt: '',
          products: [],
        });
        showSuccessToast('Oferta creada con exito');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        showErrorToast(error.message);
      } else {
        const message = options?.offerId
          ? 'Error al actualizar la oferta'
          : 'Error al crear la oferta';
        setErrorMessage(message);
        showErrorToast(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useFetch<Offer>({
    key: `offer-${options?.offerId ?? ''}`,
    enabled: !!options?.offerId,
    fetcher: () => offersApi.getById(options!.offerId!),
    onSuccess: (offer) => {
      const nextProducts = (offer.products ?? []).map((product) => ({
        id: product.id,
        label: product.name,
      }));

      form.reset({
        name: offer.name ?? '',
        discountPercentage: offer.discountPercentage ?? 0,
        offerStartsAt: toDateTimeLocal(offer.offerStartsAt ?? null),
        offerEndsAt: toDateTimeLocal(offer.offerEndsAt ?? null),
        products: nextProducts,
      });
    },
    onError: () => {
      setErrorMessage('Error al cargar la oferta');
    },
    onLoading: (isLoading) => setFetching(isLoading),
  });

  const loading = submitting || fetching;

  return {
    register: form.register,
    control: form.control,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    onSubmit,
    goBack,
    loading,
    fetching,
    errorMessage,
    selectedProducts,
    selectedRange,
    handleProductsChange,
    handleRangeChange,
  };
};
