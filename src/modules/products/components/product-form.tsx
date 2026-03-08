import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormHandleSubmit, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ProductForm } from '../schemas/schemas';

interface ProductFormProps {
    register: UseFormRegister<ProductForm>;
    handleSubmit: UseFormHandleSubmit<ProductForm>;
    onSubmit: (data: ProductForm) => void;
    goBack: () => void;
    loading?: boolean;
    errors: FieldErrors<ProductForm>;
    errorMessage?: string | null;
    title?: string;
    submitLabel?: string;
}

export const ProductFormComponent: React.FC<ProductFormProps> = ({
    register,
    handleSubmit,
    onSubmit,
    goBack,
    loading = false,
    errors,
    errorMessage = null,
    title = 'Producto',
    submitLabel = 'Enviar',
}) => {
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

                    {errorMessage && (
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Guardando...' : submitLabel}
                    </Button>
                </form>
            </Card>
        </div>
    );
};
