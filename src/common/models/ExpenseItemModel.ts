import ItemModel from './ItemModel'

interface ExpenseItem extends ItemModel {
  expense_id?: number
}

export default ExpenseItem