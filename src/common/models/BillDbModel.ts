import Customer from './CustomerModel'

interface BillDbModel {
  invoice_id: string;
  amount: number;
  date_created: string;
  date_paid?: string;
  customer_name: string;
  customer: Customer;
  comment?: string;
  file_path?: string;
}

export default BillDbModel