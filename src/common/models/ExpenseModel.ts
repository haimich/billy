interface Expense {
  id?: number
  type_id: number
  preTaxAmount: number
  taxrate: number
  date: string
  comment?: string
}

export default Expense