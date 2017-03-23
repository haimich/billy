import ExpenseTypeModel from './ExpenseTypeModel'
import ExpenseFileModel from './ExpenseFileModel'
import ExpenseItem from './ExpenseItemModel'

interface ExpenseDbModel {
  id: number
  items: ExpenseItem[]
  type?: ExpenseTypeModel
  type_name?: string
  preTaxAmount: number
  taxrate: number
  date: string
  comment?: string
  files?: ExpenseFileModel[]
}

export interface EnrichedExpense extends ExpenseDbModel {
  netAmount: number,
  preTaxAmount: number,
  taxrate: number,
  vatAmount: number
}

export default ExpenseDbModel