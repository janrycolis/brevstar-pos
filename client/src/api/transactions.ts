import type { Transaction, CreateTransactionData } from "../types/Transaction";
import { authHeaders } from "./auth";

const BASE = "/api/transactions";

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function fetchTransaction(id: string): Promise<Transaction> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch transaction");
  return res.json();
}

export async function createTransaction(
  data: CreateTransactionData,
): Promise<Transaction> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed" }));
    throw new Error(err.error || "Failed to create transaction");
  }
  return res.json();
}
