interface ExpenseDbModel {
  id: number
  type: string
  preTaxAmount: number
  taxrate: number
  date: string
}

export default ExpenseDbModel