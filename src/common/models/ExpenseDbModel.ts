import ExpenseTypeModel from './ExpenseTypeModel'
import ExpenseFileModel from './ExpenseFileModel'

interface ExpenseDbModel {
  id: number
  type?: ExpenseTypeModel
  type_name?: string
  preTaxAmount: number
  taxrate: number
  date: string
  comment?: string
  files?: ExpenseFileModel[]
}

export default ExpenseDbModel