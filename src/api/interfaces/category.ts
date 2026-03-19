export interface Category {
  id: string;
  name: string;
  parentId?: string;
  parentName?: string;
}

export interface CategoryCreate {
  name: string;
  parentId?: string;
}

export interface CategoryUpdate {
  name?: string;
  parentId?: string;
}