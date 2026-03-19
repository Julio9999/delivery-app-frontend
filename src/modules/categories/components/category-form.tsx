"use no memo";
import React, { useCallback } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SelectAsyncPaginated } from '@/components/common/select-async-paginate/select-async-paginated';
import { searchApi } from '@/api/search/search';

import { useCategoryForm } from '../hooks/use-category-form';

interface CategoryFormProps {
    categoryId?: string;
    title?: string;
    submitLabel?: string;
}

export const CategoryFormComponent: React.FC<CategoryFormProps> = ({
    categoryId,
    title = 'Categor�a',
    submitLabel = 'Enviar',
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        onSubmit,
        goBack,
        loading,
        errors,
        errorMessage,
        parentLabel,
        setParentLabel,
    } = useCategoryForm({ categoryId });

    const parentId = watch('parentId');

    const fetchCategories = useCallback(
        async (params: { page?: number; pageSize?: number; search?: string }) => {
            const result = await searchApi.searchCategories(params);
            if (!categoryId) return result;
            return {
                ...result,
                items: result.items.filter((item) => item.id !== categoryId),
            };
        },
        [categoryId],
    );

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
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel>Categoria padre (opcional)</FieldLabel>
                        <SelectAsyncPaginated
                            fetcher={fetchCategories}
                            value={parentId ?? null}
                            selectedLabel={parentLabel}
                            onValueChange={(id, label) => {
                                setValue('parentId', id ?? undefined);
                                setParentLabel(label);
                            }}
                            placeholder="Selecciona una categoria padre"
                            searchPlaceholder="Buscar categoria..."
                            allowClear
                            clearLabel="Sin padre"
                        />
                        {errors.parentId && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.parentId.message}
                            </p>
                        )}
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
