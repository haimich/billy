import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initFiles, createFile, deleteFileById, deleteFilesByPathPattern, getFilesForExpenseId } from '../../../src/common/repositories/expenseFilesRepository'
import { init as initExpenses, createExpense, deleteExpensesByCommentPattern } from '../../../src/common/repositories/expensesRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-expenseFilesRepositoryTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenses(knexInstance)
  await initFiles(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern(PREFIX + '%')
  await deleteExpensesByCommentPattern(PREFIX + '%')
})

describe('expenseFilesRepository', () => {
  let expense

  beforeEach(async () => {
    expense = await createExpense({
      date: '2016-05-27',
      type_id: 1,
      comment: PREFIX + 'foo'
    })
  })

  describe('createFile', () => {
    it('should return the created file', async () => {
      const file = await createFile({
        expense_id: expense.id,
        path: PREFIX + '/foo/bla.doc'
      })

      expect(file.path).to.equal(PREFIX + '/foo/bla.doc')
      expect(file.expense_id).to.equal(expense.id)
    })
  })

  describe('deleteFile', () => {
    it('should delete the file', async () => {
      const file = await createFile({
        expense_id: expense.id,
        path: PREFIX + '/foo/bla.doc'
      })

      await deleteFileById(file.id)

      expect(file.path).to.equal(PREFIX + '/foo/bla.doc')
      expect(file.expense_id).to.equal(expense.id)
    })
  })

  describe('getFilesForExpenseId', () => {
    it('should return the files associated with the given expense ID', async () => {
      await createFile({
        expense_id: expense.id,
        path: PREFIX + '/foo/bar.doc'
      })
      await createFile({
        expense_id: expense.id,
        path: PREFIX + '/foo/baz.doc'
      })

      const files = await getFilesForExpenseId(expense.id)

      expect(files.length).to.equal(2)
      expect(files[0].path).to.equal(PREFIX + '/foo/bar.doc')
      expect(files[1].path).to.equal(PREFIX + '/foo/baz.doc')
    })
  })

})