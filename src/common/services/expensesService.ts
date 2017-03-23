import ExpenseDbModel from '../models/ExpenseDbModel'
import Expense from '../models/ExpenseModel'
import * as expensesRepo from '../repositories/expensesRepository'
import * as expenseItemsRepo from '../repositories/expenseItemsRepository'
import * as filesRepo from '../repositories/expenseFilesRepository'

/**
 * Return a list of all expenses with files and items.
 */
export async function listExpenses(): Promise<ExpenseDbModel[]> {
  let expenses = await expensesRepo.listExpenses()

  await Promise.all(expenses.map(addFiles))
  return await Promise.all(expenses.map(addExpenseItems))
}

/**
 * Return a single expense with its files and itmes.
 */
export async function getExpenseById(id: number): Promise<ExpenseDbModel> {
  let expense = await expensesRepo.getExpenseById(id)

  await addFiles(expense)
  return await addExpenseItems(expense)
}

async function addFiles(expense: ExpenseDbModel): Promise<ExpenseDbModel> {
  let files = await filesRepo.getFilesForExpenseId(expense.id)

  return Object.assign(expense, {
    files
  })
}

async function addExpenseItems(expense: ExpenseDbModel): Promise<ExpenseDbModel> {
  let items = await expenseItemsRepo.getExpenseItemsByExpenseId(expense.id)

  return Object.assign(expense, {
    items
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
