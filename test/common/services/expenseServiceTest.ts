import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initExpenses } from '../../../src/common/repositories/expensesRepository'
import { init as initFiles } from '../../../src/common/repositories/expenseFilesRepository'
import { createExpense, deleteExpensesByCommentPattern } from '../../../src/common/services/expensesService'
import { createFile, deleteFilesByPathPattern } from '../../../src/common/services/expenseFilesService'
import { listExpenses, getExpenseById } from '../../../src/common/services/expensesService'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-expensesServiceTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenses(knexInstance)
  await initFiles(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern(PREFIX + '%')
  await deleteExpensesByCommentPattern(PREFIX + '%')
})

describe('expensesService', () => {

  describe('listExpenses', () => {
    it('should return all expenses sorted by date with files', async () => {
      const expenses = await listExpenses()

      expect(expenses.length).to.be.above(1)
      expect(moment(expenses[0].date).isBefore(moment(expenses[1].date))).to.be.true
      expect(expenses[0].files).to.be.ok
    })
  })

  describe('getExpenseById', () => {
    it('should return the expense that matches the id', async () => {
      const expense = await createExpense({
        preTaxAmount: 123.45,
        taxrate: 12,
        type_id: 1,
        date: moment().toISOString(),
        comment: PREFIX + 'foo'
      })
      const result = await getExpenseById(expense.id)

      expect(result.id).to.equal(expense.id)
      expect(result.preTaxAmount).to.equal(123.45)
      expect(result.taxrate).to.equal(12)
      expect(result.files).to.be.ok
      expect(result.type).to.be.ok
      expect(result.type.id).to.equal(1)
    })

    it('should return the expense that matches the id including its files', async () => {
      const expense = await createExpense({
        preTaxAmount: 123.45,
        taxrate: 12,
        type_id: 1,
        date: moment().toISOString(),
        comment: PREFIX + 'foo'
      })
      await createFile({
        expense_id: expense.id,
        path: PREFIX + '/foo/bla.doc'
      })
      const result = await getExpenseById(expense.id)

      expect(result.id).to.equal(expense.id)
      expect(result.preTaxAmount).to.equal(123.45)
      expect(result.taxrate).to.equal(12)
      expect(result.files.length).to.equal(1)
      expect(result.files[0].path).to.equal(PREFIX + '/foo/bla.doc')
    })
  })
})