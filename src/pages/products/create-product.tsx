import { ProductFormComponent as ProductForm } from '@/modules/products/components/product-form';

export const CreateProductPage = () => {

  return (
    <ProductForm
      title="Crear producto"
      submitLabel="Crear producto"
    />
  );
};