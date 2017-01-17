import ExpenseType from '../models/ExpenseTypeModel'
import * as expenseTypesRepo from '../repositories/expenseTypesRepository'

export function createExpenseType(expenseType: ExpenseType): Promise<ExpenseType> {
  return expenseTypesRepo.createExpenseType(expenseType)
}

export function updateExpenseType(expenseType: ExpenseType): Promise<ExpenseType> {
  return expenseTypesRepo.updateExpenseType(expenseType)
}

export function getExpenseTypeById(id: number): Promise<ExpenseType> {
  return expenseTypesRepo.getExpenseTypeById(id)
}

export function getExpenseTypeByType(type: string): Promise<ExpenseType> {
  return expenseTypesRepo.getExpenseTypeByType(type)
}

export function listExpenseTypes(): Promise<ExpenseType[]> {
  return expenseTypesRepo.listExpenseTypes()
}

export function deleteExpenseTypeById(id: number): Promise<void> {
  return expenseTypesRepo.deleteExpenseTypeById(id)
}

export function deleteExpenseTypeByNamePattern(namePattern: string): Promise<void> {
  return expenseTypesRepo.deleteExpenseTypeByNamePattern(namePattern)
}
