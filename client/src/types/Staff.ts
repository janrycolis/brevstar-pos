export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pin: string | null;
  role: "admin" | "manager" | "cashier";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pin: string | null;
  role: "admin" | "manager" | "cashier";
  isActive: boolean;
}
