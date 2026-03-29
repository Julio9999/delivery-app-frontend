import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFetch } from '@/hooks/useFetch';
import { categorySchema, type CategoryForm } from '../schemas/schemas';
import type { Category, CategoryCreate, CategoryUpdate } from '@/api/interfaces/category';
import { categoriesApi } from '@/api/categories/categories';
import { showErrorToast, showSuccessToast } from '@/lib/utils';

interface UseCategoryFormOptions {
	categoryId?: string;
}

export const useCategoryForm = (options?: UseCategoryFormOptions) => {
	const [submitting, setSubmitting] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [parentLabel, setParentLabel] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

	const navigate = useNavigate();

	const goBack = () => {
		navigate('/categories');
	};

	const form = useForm<CategoryForm>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: '',
			parentId: undefined,
		},
	});

	const onSubmit = async (data: CategoryForm) => {
		setErrorMessage(null);
		setSubmitting(true);
		try {
			if (options?.categoryId) {
				const payload: CategoryUpdate = {
					name: data.name,
					parentId: data.parentId || undefined,
				};
				const updated = await categoriesApi.update(options.categoryId, payload);
				let finalCategory = updated;

				if (imageFile) {
					finalCategory = await categoriesApi.uploadImage(options.categoryId, imageFile);
					setImageFile(null);
				}

				setCurrentImageUrl(finalCategory.imageUrl || null);
				showSuccessToast('Categoría actualizada con éxito');
			} else {
				const payload: CategoryCreate = {
					name: data.name,
					parentId: data.parentId || undefined,
				};
				const created = await categoriesApi.create(payload);
				let finalCategory = created;

				if (imageFile) {
					finalCategory = await categoriesApi.uploadImage(created.id, imageFile);
				}

				setCurrentImageUrl(finalCategory.imageUrl || null);
				setImageFile(null);
				form.reset();
				setParentLabel(null);
				showSuccessToast('Categoría creada con éxito');
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				showErrorToast(e.message);
				setErrorMessage(e.message);
			} else {
				showErrorToast(
					options?.categoryId
						? 'Error al actualizar la categoría'
						: 'Error al crear la categoría',
				);
				setErrorMessage(
					options?.categoryId
						? 'Error al actualizar la categoría'
						: 'Error al crear la categoría',
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
		formState: { errors },
	} = form;

	useFetch<Category>({
		key: `category-${options?.categoryId ?? ''}`,
		enabled: !!options?.categoryId,
		fetcher: () => categoriesApi.getById(options!.categoryId!),
		onSuccess: (cat) => {
			form.reset({
				name: cat.name,
				parentId: cat.parentId || undefined,
			});
			setCurrentImageUrl(cat.imageUrl || null);
			setImageFile(null);
			if (cat.parentId) {
				categoriesApi.getById(cat.parentId).then((parent) => {
					setParentLabel(parent.name);
				});
			} else {
				setParentLabel(null);
			}
		},
		onError: () => {
			setErrorMessage('Error al cargar la categoría');
		},
		onLoading: (loading) => setFetching(loading),
	});

	const loading = submitting || fetching;

	return {
		register,
		handleSubmit,
		setValue,
		watch,
		onSubmit,
		goBack,
		errors,
		loading,
		errorMessage,
		parentLabel,
		setParentLabel,
		imageFile,
		setImageFile,
		currentImageUrl,
	};
};
