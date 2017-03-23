import { EnrichedBill } from '../models/BillDbModel'
import BillDbModel from '../models/BillDbModel'
import { round, getNetAmount, getVatAmount } from '../helpers/math'

export function getEnrichedBills(bills: BillDbModel[]): EnrichedBill[] {
  let enriched: EnrichedBill[] = []

  for (let bill of bills) {
    let item = bill.items[0] // adapt this line when multiple bill items are implemented

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