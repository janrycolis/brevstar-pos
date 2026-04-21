import type { Category, SubCategory } from "./Category";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  price: number;
  type: "item" | "service";
  quantity: number;
  categoryId: string | null;
  subCategoryId: string | null;
  category?: Category | null;
  subCategory?: SubCategory | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "category" | "subCategory"
>;
