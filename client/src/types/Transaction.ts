export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface TransactionCashier {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Transaction {
  id: string;
  receiptNumber: string;
  cashierId: string;
  cashier: TransactionCashier | null;
  subtotal: number;
  tax: number;
  total: number;
  amountTendered: number;
  change: number;
  items: TransactionItem[];
  createdAt: string;
}

export interface CreateTransactionData {
  subtotal: number;
  tax: number;
  total: number;
  amountTendered: number;
  change: number;
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}
