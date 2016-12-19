import Customer from './CustomerModel'
import FileModel from './FileModel'
import BillTypeModel from './BillTypeModel'

interface BillDbModel {
  id: number
  invoice_id: string
  amount: number
  date_created: string
  date_paid?: string
  customer_name: string
  customer: Customer
  type?: BillTypeModel
  type_name?: string
  comment?: string
  files: FileModel[]
}

export default BillDbModel