import type { Staff, StaffFormData } from "../types/Staff";
import { authHeaders } from "./auth";

const BASE = "/api/staff";

export async function fetchStaffList(): Promise<Staff[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
}

export async function fetchStaffMember(id: string): Promise<Staff> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch staff member");
  return res.json();
}

export async function createStaff(data: StaffFormData): Promise<Staff> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create staff");
  return res.json();
}

export async function updateStaff(
  id: string,
  data: Partial<StaffFormData>,
): Promise<Staff> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update staff");
  return res.json();
}

export async function deleteStaff(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete staff");
}
