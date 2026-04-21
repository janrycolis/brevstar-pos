import type {
  Category,
  CategoryFormData,
  SubCategoryFormData,
  SubCategory,
} from "../types/Category";
import { authHeaders } from "./auth";

const BASE = "/api/categories";

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchCategory(id: string): Promise<Category> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export async function createCategory(
  data: CategoryFormData,
): Promise<Category> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>,
): Promise<Category> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete category");
}

export async function createSubCategory(
  categoryId: string,
  data: SubCategoryFormData,
): Promise<SubCategory> {
  const res = await fetch(`${BASE}/${categoryId}/sub-categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create sub-category");
  return res.json();
}

export async function updateSubCategory(
  categoryId: string,
  subId: string,
  data: Partial<SubCategoryFormData>,
): Promise<SubCategory> {
  const res = await fetch(`${BASE}/${categoryId}/sub-categories/${subId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update sub-category");
  return res.json();
}

export async function deleteSubCategory(
  categoryId: string,
  subId: string,
): Promise<void> {
  const res = await fetch(`${BASE}/${categoryId}/sub-categories/${subId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete sub-category");
}
