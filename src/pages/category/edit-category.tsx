import { useParams } from 'react-router';
import { CategoryFormComponent as CategoryForm } from '@/modules/categories/components/category-form';

export const EditCategoryPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <CategoryForm
      categoryId={id}
      title="Editar categoría"
      submitLabel="Guardar cambios"
    />
  );
};
