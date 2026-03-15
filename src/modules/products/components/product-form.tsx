"use no memo";
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWatch } from 'react-hook-form';
import { useProductForm } from '../hooks/use-product-form';
import { SelectAsyncPaginated } from '@/components/common/select-async-paginate/select-async-paginated';
import { searchApi } from '@/api/search/search';

interface ProductFormProps {
    productId?: string;
    title?: string;
    submitLabel?: string;
}

export const ProductFormComponent: React.FC<ProductFormProps> = ({
    productId,
    title = 'Producto',
    submitLabel = 'Enviar',
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        onSubmit,
        goBack,
        loading,
        errors,
        errorMessage,
    } = useProductForm({ productId });

    const category = useWatch({ control, name: 'category' });
    return (
        <div className="mx-auto">
            <Card className="w-200 mx-auto px-4">
                <CardHeader className="text-2xl font-bold mb-4 flex">
                    <Button onClick={goBack}>Volver</Button>
                    {title}
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field>
                        <FieldLabel>Nombre</FieldLabel>
                        <Input type="text" {...register('name')} />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Descripción</FieldLabel>
                        <Textarea {...register('description')} />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Precio</FieldLabel>
                        <Input
                            type="number"
                            {...register('price', { valueAsNumber: true })}
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.price.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Stock</FieldLabel>
                        <Input
                            type="number"
                            {...register('stock', { valueAsNumber: true })}
                        />
                        {errors.stock && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.stock.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Categoría (opcional)</FieldLabel>
                        <SelectAsyncPaginated
                            fetcher={searchApi.searchCategories}
                            value={category?.id ?? null}
                            selectedLabel={category?.label ?? null}
                            onValueChange={(id, label) => {
                                setValue(
                                    'category',
                                    id && label ? { id, label } : undefined,
                                );
                            }}
                            placeholder="Selecciona una categoría"
                            searchPlaceholder="Buscar categoría..."
                        />
                    </Field>

                    {errorMessage && (
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full  text-white py-2 rounded-md  disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Guardando...' : submitLabel}
                    </Button>
                </form>
            </Card>
        </div>
    );
};
