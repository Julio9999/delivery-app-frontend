import { useProductForm } from '@/modules/products/hooks/use-product-form';
import { ProductFormComponent as ProductForm } from '@/modules/products/components/product-form';

export const CreateProductPage = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    goBack,
    loading,
    errors,
    errorMessage,
  } = useProductForm();

  return (
    <ProductForm
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      goBack={goBack}
      loading={loading}
      errors={errors}
      errorMessage={errorMessage}
      title="Crear producto"
      submitLabel="Crear producto"
    />
  );
};