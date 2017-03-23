import ExpenseItem from '../models/ExpenseItemModel'
import * as expenseItemsRepo from '../repositories/expenseItemsRepository'

export function createExpenseItem(expenseItem: ExpenseItem): Promise<ExpenseItem> {
  return expenseItemsRepo.createExpenseItem(expenseItem)
}

export function updateExpenseItem(expenseItem: ExpenseItem): Promise<ExpenseItem> {
  return expenseItemsRepo.updateExpenseItem(expenseItem)
}

export function getExpenseItemById(id: number): Promise<ExpenseItem> {
  return expenseItemsRepo.getExpenseItemById(id)
}

export function getExpenseItemsByExpenseId(billId: number): Promise<ExpenseItem[]> {
  return expenseItemsRepo.getExpenseItemsByExpenseId(billId)
}

export function deleteExpenseItemById(id: number): Promise<void> {
  return expenseItemsRepo.deleteExpenseItemById(id)
}

export function deleteExpenseItemByDescriptionPattern(descriptionPattern: string): Promise<void> {
  return expenseItemsRepo.deleteExpenseItemByDescriptionPattern(descriptionPattern)
}
