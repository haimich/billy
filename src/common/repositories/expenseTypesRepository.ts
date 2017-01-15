import ExpenseType from '../models/ExpenseTypeModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createExpenseType(expenseType: ExpenseType): Promise<ExpenseType> {
  return db('expense_types')
    .insert(expenseType)
    .then((rows) => {
      return getExpenseTypeById(rows[0])
    })
}

export function updateExpenseType(expenseType: ExpenseType): Promise<ExpenseType> {
  return db('expense_types')
    .update({
      type: expenseType.type
    })
    .where('id', expenseType.id)
}

export function getExpenseTypeById(id: number): Promise<ExpenseType> {
  return db('expense_types')
    .where('id', id)
    .first()
}

export function listExpenseTypes(): Promise<ExpenseType[]> {
  return db('expense_types')
    .select('*')
    .orderBy('type')
}

export function deleteExpenseTypeById(id: number): Promise<void> {
  return db('expense_types')
    .delete()
    .where('id', id)
}

export function deleteExpenseTypeByNamePattern(namePattern: string): Promise<void> {
  return db('expense_types')
    .delete()
    .where('type', 'like', namePattern)
}
