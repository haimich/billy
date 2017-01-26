import FileModel from './FileModel'

interface ExpenseFile extends FileModel {
  expense_id: number
}

export default ExpenseFile