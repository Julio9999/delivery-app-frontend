import { useParams } from 'react-router';
import { useProductForm } from '@/modules/products/hooks/use-product-form';
import { ProductFormComponent as ProductForm } from '@/modules/products/components/product-form';

export const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    onSubmit,
    goBack,
    loading,
    fetching,
    errors,
    errorMessage,
  } = useProductForm({ productId: id });

  if (fetching && id) {
    return <p>Cargando producto...</p>;
  }

  return (
    <ProductForm
      goBack={goBack}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
      errors={errors}
      errorMessage={errorMessage}
      title="Editar producto"
      submitLabel="Guardar cambios"
    />
  );
};