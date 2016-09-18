interface Bill {
  id?: string;
  customer_id: number;
  amount: number;
  date_created: Date;
  date_paid?: Date;
  comment?: string;
  file_path?: string;
}

export default Bill