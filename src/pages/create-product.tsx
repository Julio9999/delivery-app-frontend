import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { productsApi } from '../api/products/products';
import type { ProductCreate } from '../api/interfaces/product';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const productSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    description: z.string(),
    price: z
        .number()
        .min(0, 'El precio debe ser mayor o igual a 0'),
    stock: z
        .number()
        .int('El stock debe ser un número entero')
        .min(0, 'El stock debe ser mayor o igual a 0'),
});

type ProductForm = z.infer<typeof productSchema>;

export const CreateProductPage = () => {

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const form = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
        },
    });

    const onSubmit = async (data: ProductForm) => {
        setErrorMessage(null);
        setLoading(true);
        try {
            const payload: ProductCreate = {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
            };
            await productsApi.create(payload);
            form.reset();
            alert('Producto creado con éxito');
        } catch (e: unknown) {
            if (e instanceof Error) {
                setErrorMessage(e.message);
            } else {
                setErrorMessage('Error al crear el producto');
            }
        } finally {
            setLoading(false);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <div className="p-4 max-w-200  flex-1 h-full">
            <h1 className="text-2xl font-bold mb-4">Crear producto</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input
                        type="text"
                        {...register('name')}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel>Descripción</FieldLabel>
                    <Textarea
                        {...register('description')}
                    />
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
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Creando...' : 'Crear producto'}
                </Button>
            </form>
        </div>
    );
};