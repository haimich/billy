import ExpenseDbModel from '../models/ExpenseDbModel'
import Expense from '../models/ExpenseModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function expenseExists(id: number): Promise<boolean> {
  return db('expenses')
    .select('id')
    .where('id', id)
    .then(rows => rows.length === 0 ? false : true)
}

export function createExpense(expense: Expense): Promise<ExpenseDbModel> {
  return db('expenses')
    .insert(expense)
    .then((rows) => {
      return getExpenseById(rows[0])
    })
}

export function updateExpense(expense: ExpenseDbModel): Promise<ExpenseDbModel> {
  return db('expenses')
    .update({
      type: expense.type,
      preTaxAmount: expense.preTaxAmount,
      taxrate: expense.taxrate,
      date: expense.date
    })
    .where('id', expense.id)
    .then(() => {
      return getExpenseById(expense.id)
    })
}

export function getExpenseById(id: number): Promise<ExpenseDbModel> {
  return db('expenses')
    .select('*')
    .where('id', id)
    .then(rows => {
      if (rows == null || rows.length !== 1) {
        return
      }

      return rows[0]
    })
}

export function listExpenses(): Promise<ExpenseDbModel[]> {
  return db('expenses')
    .select('*')
    .orderBy('date', 'asc')
}

export function deleteExpenseById(id: number): Promise<any> {
  return db('expenses')
    .delete()
    .where('id', id)
}

export function deleteExpensesByTypePattern(typePattern: string): Promise<any> {
  return db('expenses')
    .delete()
    .where('type', 'like', typePattern)
}
