export interface SubCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  subCategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface SubCategoryFormData {
  name: string;
  description: string | null;
  isActive: boolean;
}
