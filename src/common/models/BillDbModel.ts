import Customer from './CustomerModel'
import BillFileModel from './BillFileModel'
import BillTypeModel from './BillTypeModel'
import BillItem from './BillItem'

interface BillDbModel {
  id: number
  invoice_id: string
  articles: BillItem[]
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