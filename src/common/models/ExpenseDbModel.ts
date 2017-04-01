import ExpenseTypeModel from './ExpenseTypeModel'
import ExpenseFileModel from './ExpenseFileModel'
import ExpenseItem from './ExpenseItemModel'

interface ExpenseDbModel {
  id: number
  items: ExpenseItem[]
  type?: ExpenseTypeModel
  type_name?: string
  date: string
  comment?: string
  files?: ExpenseFileModel[]
}

export interface EnrichedExpense extends ExpenseDbModel {
  preTaxAmount: number
  taxrate: number
  netAmount: number
  vatAmount: number
}

export default ExpenseDbModel