export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  parentId?: string;
  parentName?: string;
}

export interface CategoryCreate {
  name: string;
  imageUrl?: string;
  parentId?: string;
}

export interface CategoryUpdate {
  name?: string;
  imageUrl?: string;
  parentId?: string;
}