import ExpenseType from '../models/ExpenseTypeModel'
import * as expenseTypesRepo from '../repositories/expenseTypesRepository'

export function createExpenseType(expenseType: ExpenseType): Promise<ExpenseType> {
  return expenseTypesRepo.createExpenseType(expenseType)
}

export function updateBillType(expenseType: ExpenseType): Promise<ExpenseType> {
  return expenseTypesRepo.updateExpenseType(expenseType)
}

export function getBillTypeById(id: number): Promise<ExpenseType> {
  return expenseTypesRepo.getExpenseTypeById(id)
}

export function listBillTypes(): Promise<ExpenseType[]> {
  return expenseTypesRepo.listExpenseTypes()
}

export function deleteBillTypeById(id: number): Promise<void> {
  return expenseTypesRepo.deleteExpenseTypeById(id)
}

export function deleteBillTypeByNamePattern(namePattern: string): Promise<void> {
  return expenseTypesRepo.deleteExpenseTypeByNamePattern(namePattern)
}
