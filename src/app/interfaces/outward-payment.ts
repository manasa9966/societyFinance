export interface OutwardPayment {
  amount: number;
  checker: {
    checkedAt: string;
    checkerId: string;
  };
  createdAt: string;
  createdBy: string;
  description: string;
  fileName: string;
  id: string;
  invoiceNumber: string;
  notes: string;
  paymentMethod: string;
  status: string;
  vendorName: string;
}