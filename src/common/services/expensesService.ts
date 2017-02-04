import ExpenseDbModel from '../models/ExpenseDbModel'
import Expense from '../models/ExpenseModel'
import * as expensesRepo from '../repositories/expensesRepository'
import * as filesRepo from '../repositories/expenseFilesRepository'

/**
 * Return a list of all expenses with files.
 */
export async function listExpenses(): Promise<ExpenseDbModel[]> {
  let expenses = await expensesRepo.listExpenses()

  return await Promise.all(expenses.map(addFiles))
}

/**
 * Return a single expense with its files.
 */
export async function getExpenseById(id: number): Promise<ExpenseDbModel> {
  let expense = await expensesRepo.getExpenseById(id)

  return await addFiles(expense)
}

async function addFiles(expense: ExpenseDbModel): Promise<ExpenseDbModel> {
  let files = await filesRepo.getFilesForExpenseId(expense.id)

  return Object.assign(expense, {
    files
  })
}

export function expenseExists(id: number): Promise<boolean> {
  return expensesRepo.expenseExists(id)
}

export function createExpense(expense: Expense): Promise<ExpenseDbModel> {
  return expensesRepo.createExpense(expense)
}

export function updateExpense(expense: Expense): Promise<ExpenseDbModel> {
  return expensesRepo.updateExpense(expense)
}

export function deleteExpenseById(id: number): Promise<any> {
  return expensesRepo.deleteExpenseById(id)
}

export function deleteExpensesByCommentPattern(typePattern: string): Promise<any> {
  return expensesRepo.deleteExpensesByCommentPattern(typePattern)
}
