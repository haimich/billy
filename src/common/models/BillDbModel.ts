import Customer from './CustomerModel'

interface BillDbModel {
  id: number;
  invoice_id: string;
  amount: number;
  date_created: string;
  date_paid?: string;
  customer_name: string;
  customer: Customer;
  comment?: string;
  files?: string[];
}

export default BillDbModel