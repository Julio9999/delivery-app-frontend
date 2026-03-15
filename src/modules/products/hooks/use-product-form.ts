import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/useFetch";

import { productSchema, type ProductForm } from "../schemas/schemas";
import type { Product, ProductCreate } from "@/api/interfaces/product";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { productsApi } from "@/api/products/products";
import { useNavigate } from "react-router";

interface UseProductFormOptions {
  productId?: string;
}

export const useProductForm = (options?: UseProductFormOptions) => {
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useNavigate()

  const goBack = () => {
    router('/products')
  }

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: undefined,
    },
  });

  const onSubmit = async (data: ProductForm) => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const payload: ProductCreate = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.category?.id || undefined,
      };

      if (options?.productId) {
        await productsApi.update(options.productId, payload);
        showSuccessToast("Producto actualizado con éxito");
      } else {
        await productsApi.create(payload);
        form.reset();
        showSuccessToast("Producto creado con éxito");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        showErrorToast(e.message);
      } else {
        showErrorToast(
          options?.productId
            ? "Error al actualizar el producto"
            : "Error al crear el producto",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = form;

  useFetch<Product>({
    key: `product-${options?.productId ?? ""}`,
    enabled: !!options?.productId,
    fetcher: () => productsApi.getById(options!.productId!),
    onSuccess: (prod) => {
      console.log(prod)
      form.reset({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        category: prod.category?.id
          ? { id: prod.category.id, label: prod.category.name }
          : undefined,
      });
    },
    onError: () => {
      setErrorMessage("Error al cargar el producto");
    },
    onLoading: (l) => setFetching(l),
  });

  const loading = submitting || fetching;

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    onSubmit,
    goBack,
    errors,
    loading,
    fetching,
    errorMessage,
  };
};
