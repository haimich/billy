import { EnrichedBill } from '../models/BillDbModel'
import { EnrichedExpense } from '../models/ExpenseDbModel'
import BillDbModel from '../models/BillDbModel'
import ExpenseDbModel from '../models/ExpenseDbModel'
import { round, getNetAmount, getVatAmount } from '../helpers/math'

export function getEnrichedBills(bills: BillDbModel[]): EnrichedBill[] {
  let enriched: EnrichedBill[] = []

  for (let bill of bills) {
    let item = bill.items[0] // adapt this line when multiple bill items are implemented

    if (item == null) {
      console.log("Bill with no item", bill)
      continue
    }

    let exp = Object.assign(bill, {
      preTaxAmount: item.preTaxAmount,
      netAmount: getNetAmount(item.taxrate, item.preTaxAmount),
      taxrate: item.taxrate,
      vatAmount: getVatAmount(item.taxrate, item.preTaxAmount)
    })

    enriched.push(exp)
  }

  return enriched
}

export function getEnrichedExpenses(expenses: ExpenseDbModel[]): EnrichedExpense[] {
  let enriched: EnrichedExpense[] = []

  for (let expense of expenses) {
    let item = expense.items[0] // adapt this line when multiple expense items are implemented

    if (item == null) {
      console.log("Expense with no item", expense)
      continue
    }

    let exp = Object.assign(expense, {
      preTaxAmount: item.preTaxAmount,
      netAmount: getNetAmount(item.taxrate, item.preTaxAmount),
      taxrate: item.taxrate,
      vatAmount: getVatAmount(item.taxrate, item.preTaxAmount)
    })

    enriched.push(exp)
  }

  return enriched
}