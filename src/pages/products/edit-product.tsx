import { useParams } from 'react-router';
import { ProductFormComponent as ProductForm } from '@/modules/products/components/product-form';

export const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ProductForm
      productId={id}
      title="Editar producto"
      submitLabel="Guardar cambios"
    />
  );
};