import ExpenseDbModel from '../models/ExpenseDbModel'
import Expense from '../models/ExpenseModel'
import * as expensesRepo from '../repositories/expensesRepository'

export function expenseExists(id: number): Promise<boolean> {
  return expensesRepo.expenseExists(id)
}

export function createExpense(expense: Expense): Promise<ExpenseDbModel> {
  return expensesRepo.createExpense(expense)
}

export function updateExpense(expense: Expense): Promise<ExpenseDbModel> {
  return expensesRepo.updateExpense(expense)
}

export function getExpenseById(id: number): Promise<ExpenseDbModel> {
  return expensesRepo.getExpenseById(id)
}

export function listExpenses(): Promise<ExpenseDbModel[]> {
  return expensesRepo.listExpenses()
}

export function deleteExpenseById(id: number): Promise<any> {
  return expensesRepo.deleteExpenseById(id)
}

export function deleteExpensesByTypePattern(typePattern: string): Promise<any> {
  return expensesRepo.deleteExpensesByTypePattern(typePattern)
}
