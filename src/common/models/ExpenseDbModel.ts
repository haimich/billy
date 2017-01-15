import ExpenseTypeModel from './ExpenseTypeModel'

interface ExpenseDbModel {
  id: number
  type?: ExpenseTypeModel
  type_name?: string
  preTaxAmount: number
  taxrate: number
  date: string
  comment?: string
}

export default ExpenseDbModel