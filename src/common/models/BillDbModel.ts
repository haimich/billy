import Customer from './CustomerModel'
import BillFileModel from './BillFileModel'
import BillTypeModel from './BillTypeModel'
import BillItem from './BillItemModel'

interface BillDbModel {
  id: number
  invoice_id: string
  items: BillItem[]
  date_created: string
  date_paid?: string
  customer_name: string
  customer: Customer
  type?: BillTypeModel
  type_name?: string
  comment?: string
  files?: BillFileModel[]
}

export default BillDbModel