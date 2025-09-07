
export interface Payment {
  lateFee: number;
  paidAmount: number;
  paidOn: string;   // ISO Date string (e.g., "2025-01-10T10:15:00.000Z")
  paymentId: string;
  status: "PAID" | "PENDING" | "FAILED"; // can extend as needed
}

// Payments in a month (keyed by dynamic payment IDs like "-PAYMENT_011")
export interface MonthPayments {
  [paymentKey: string]: Payment;
}

// Year-month entries (keyed like "month_2025_01", "month_2025_02", etc.)
export interface RecordMonths {
  [monthKey: string]: MonthPayments;
}

// Top-level data (keyed by recordId like "-OZ0wUTPZByYK0_LcB2t")
export interface PaymentsData {
  [recordId: string]: RecordMonths;
}

// Full dataset (array with multiple records objects)
export type PaymentsDataset = PaymentsData[];
