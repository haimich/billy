import Customer from './CustomerModel'

interface BillDbModel {
  id: string;
  amount: number;
  date_created: Date;
  customer_name: string;
  customer: Customer;
  date_paid?: Date;
  comment?: string;
  file_path?: string;
}

export default BillDbModel