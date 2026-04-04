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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

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
      hasOffer: false,
      offerPrice: undefined,
      offerDurationHours: undefined,
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
        offerPrice: null,
        offerStartsAt: null,
        offerEndsAt: null,
      };

      if (
        data.hasOffer &&
        data.offerPrice !== undefined &&
        data.offerDurationHours !== undefined
      ) {
        const offerStartsAt = new Date();
        const offerEndsAt = new Date(
          offerStartsAt.getTime() + data.offerDurationHours * 60 * 60 * 1000,
        );

        payload.offerPrice = data.offerPrice;
        payload.offerStartsAt = offerStartsAt.toISOString();
        payload.offerEndsAt = offerEndsAt.toISOString();
      }

      if (options?.productId) {
        const updated = await productsApi.update(options.productId, payload);
        let finalProduct = updated;

        if (imageFile) {
          finalProduct = await productsApi.uploadImage(options.productId, imageFile);
          setImageFile(null);
        }

        setCurrentImageUrl(finalProduct.imageUrl || null);
        showSuccessToast("Producto actualizado con éxito");
      } else {
        const created = await productsApi.create(payload);
        let finalProduct = created;

        if (imageFile) {
          finalProduct = await productsApi.uploadImage(created.id, imageFile);
        }

        setCurrentImageUrl(finalProduct.imageUrl || null);
        setImageFile(null);
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
      const now = new Date();
      const offerEndsAt = prod.offerEndsAt ? new Date(prod.offerEndsAt) : null;
      const hasActiveOffer =
        typeof prod.offerPrice === 'number' &&
        !!offerEndsAt &&
        offerEndsAt > now;
      const offerDurationHours =
        hasActiveOffer && offerEndsAt
          ? Math.max(1, Math.ceil((offerEndsAt.getTime() - now.getTime()) / (60 * 60 * 1000)))
          : undefined;

      form.reset({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        hasOffer: hasActiveOffer,
        offerPrice: hasActiveOffer ? prod.offerPrice ?? undefined : undefined,
        offerDurationHours,
        stock: prod.stock,
        category: prod.category?.id
          ? { id: prod.category.id, label: prod.category.name }
          : undefined,
      });
      setCurrentImageUrl(prod.imageUrl || null);
      setImageFile(null);
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
    imageFile,
    setImageFile,
    currentImageUrl,
  };
};
