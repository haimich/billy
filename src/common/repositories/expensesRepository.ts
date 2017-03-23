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
    .insert({
      type_id: expense.type_id,
      date: expense.date,
      comment: expense.comment
    })
    .then((rows) => {
      return getExpenseById(rows[0])
    })
}

export function updateExpense(expense: Expense): Promise<ExpenseDbModel> {
  return db('expenses')
    .update({
      type_id: expense.type_id,
      date: expense.date,
      comment: expense.comment
    })
    .where('id', expense.id)
    .then(() => {
      return getExpenseById(expense.id)
    })
}

export function getExpenseById(id: number): Promise<ExpenseDbModel> {
  return db.raw(`
    select
      e.id,
      e.date,
      e.comment,
      et.id as type_id,
      et.type as type_name

      from expenses e

      LEFT JOIN expense_types et ON e.type_id = et.id

      where e.id = ?
  `, [id])
    .then(rows => {
      if (rows == null || rows.length !== 1) {
        return
      }

      return createExpenseDbModel(rows[0])
    })
}

export function listExpenses(): Promise<ExpenseDbModel[]> {
  return db.raw(`
    select
      e.id,
      e.date,
      e.comment,
      et.id as type_id,
      et.type as type_name

      from expenses e

      LEFT JOIN expense_types et ON e.type_id = et.id

      order by e.date asc
  `).then(rows => rows.map(createExpenseDbModel))
}

export function deleteExpenseById(id: number): Promise<any> {
  return db('expenses')
    .delete()
    .where('id', id)
}

export function deleteExpensesByCommentPattern(commentPattern: string): Promise<any> {
  return db('expenses')
    .delete()
    .where('comment', 'like', commentPattern)
}

function createExpenseDbModel(row: any): ExpenseDbModel {
  let expense = Object.assign(row, {
    type: {
      id: row.type_id,
      type: row.type_name
    }
  })
  
  return expense
}