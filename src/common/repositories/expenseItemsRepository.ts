import ExpenseItem from '../models/ExpenseItemModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createExpenseItem(expenseItem: ExpenseItem): Promise<ExpenseItem> {
  return db('expense_items')
    .insert(expenseItem)
    .then((rows) => {
      return getExpenseItemById(rows[0])
    })
}

export function updateExpenseItem(expenseItem: any): Promise<ExpenseItem> {
  return db('expense_items')
    .update({
      position: expenseItem.position,
      preTaxAmount: expenseItem.preTaxAmount,
      taxrate: expenseItem.taxrate,
      description: expenseItem.description
    })
    .where('id', expenseItem.id)
}

export function getExpenseItemById(id: number): Promise<ExpenseItem> {
  return db('expense_items')
    .where('id', id)
    .first()
}

export function getExpenseItemsByExpenseId(expenseId: number): Promise<ExpenseItem[]> {
  return db('expense_items')
    .select('*')
    .where('expense_id', expenseId)
    .orderBy('position', 'asc')
}

export function deleteExpenseItemById(id: number): Promise<void> {
  return db('expense_items')
    .delete()
    .where('id', id)
}

export function deleteExpenseItemByDescriptionPattern(descriptionPattern: string): Promise<void> {
  return db('expense_items')
    .delete()
    .where('description', 'like', descriptionPattern)
}
