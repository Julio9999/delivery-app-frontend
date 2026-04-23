import React from 'react';

import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { DatePicker } from '@/components/common/date-picker/date-picker';
import { SelectAsyncPaginated } from '@/components/common/select-async-paginate/select-async-paginated';
import { searchApi } from '@/api/search/search';

import { useOfferForm } from '../hooks/use-offer-form';

interface OfferFormProps {
  offerId?: string;
  title?: string;
  submitLabel?: string;
}

export const OfferFormComponent: React.FC<OfferFormProps> = ({
  offerId,
  title = 'Oferta',
  submitLabel = 'Guardar',
}) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    goBack,
    loading,
    fetching,
    errorMessage,
    selectedProducts,
    selectedRange,
    handleProductsChange,
    handleRangeChange,
  } = useOfferForm({ offerId });

  return (
    <div className="mx-auto overflow-auto w-full">
      <Card className="w-200 mx-auto px-4">
        <CardHeader className="text-2xl font-bold mb-4 flex">
          <Button onClick={goBack}>Volver</Button>
          {title}
        </CardHeader>
        {fetching ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8 text-primary-pink" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
              <Field>
                <FieldLabel>Nombre (opcional)</FieldLabel>
                <Input type="text" {...register('name')} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Descuento (%)</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  {...register('discountPercentage', {
                    valueAsNumber: true,
                  })}
                />
                {errors.discountPercentage && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountPercentage.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Periodo de oferta</FieldLabel>
                <DatePicker
                  enableRange
                  showTime
                  allowClear
                  rangeValue={selectedRange}
                  onRangeChange={handleRangeChange}
                  rangePlaceholder="Selecciona fecha de inicio y fin"
                />
                {errors.offerStartsAt && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerStartsAt.message}</p>
                )}
                {errors.offerEndsAt && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerEndsAt.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Agregar productos</FieldLabel>
                <SelectAsyncPaginated
                  fetcher={searchApi.searchProducts}
                  multiple
                  selectedItems={selectedProducts}
                  onValuesChange={handleProductsChange}
                  placeholder="Selecciona un producto"
                  searchPlaceholder="Buscar producto..."
                  allowClear
                  clearLabel="Limpiar productos"
                />
                {errors.products && (
                  <p className="text-red-500 text-sm mt-1">{errors.products.message}</p>
                )}
              </Field>

              {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white py-2 rounded-md disabled:opacity-50 mt-4"
              >
                {loading ? 'Guardando...' : submitLabel}
              </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
