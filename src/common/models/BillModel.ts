interface Bill {
  invoice_id: string;
  customer_id: number;
  amount: number;
  date_created: string;
  date_paid?: string;
  comment?: string;
  file_path?: string;
}

export default Bill