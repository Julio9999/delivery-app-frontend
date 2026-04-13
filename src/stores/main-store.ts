import { create, useStore } from "zustand";
import {
  createDataTableStore,
  type DataTableFilters,
  type DataTableStoreApi,
  type DataTableStoreState,
} from "@/stores/data-table-store";
import type { Product } from "@/api/interfaces/product";
import type { Category } from "@/api/interfaces/category";

interface MainState {
  products: DataTableStoreApi<Product, DataTableFilters>;
  categories: DataTableStoreApi<Category, DataTableFilters>;
  userName: string;
  setUserName: (userName: string) => void;
}

export const useMainStore = create<MainState>((set) => ({
  products: createDataTableStore<Product, DataTableFilters>(),
  categories: createDataTableStore<Category, DataTableFilters>(),
  userName: "Admin",
  setUserName: (userName: string) => set({ userName }),
}));

export const useProductsStoreState = <T>(selector: (state: DataTableStoreState<Product, DataTableFilters>) => T): T => {
  const store = useMainStore((state) => state.products);
  return useStore(store, selector);
};

export const useCategoriesStoreState = <T>(selector: (state: DataTableStoreState<Category, DataTableFilters>) => T): T => {
  const store = useMainStore((state) => state.categories);
  return useStore(store, selector);
};