import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CategoryCreate } from '@/api/interfaces/category';
import { categoriesApi } from '@/api/categories/categories';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  parentId: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export const CreateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', parentId: '' },
  });

  const onSubmit = async (data: CategoryForm) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const payload: CategoryCreate = {
        name: data.name,
        parentId: data.parentId || undefined,
      };
      await categoriesApi.create(payload);
      form.reset();
      alert('Categoría creada con éxito');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage('Error al crear la categoría');
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
      <h1 className="text-2xl font-bold mb-4">Crear categoría</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel>Nombre</FieldLabel>
          <Input type="text" {...register('name')} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Parent ID</FieldLabel>
          <Input type="text" {...register('parentId')} />
          {errors.parentId && (
            <p className="text-red-500 text-sm mt-1">{errors.parentId.message}</p>
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
          {loading ? 'Creando...' : 'Crear categoría'}
        </Button>
      </form>
    </div>
  );
};