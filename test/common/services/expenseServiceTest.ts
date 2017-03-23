import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import { init as initExpenses } from '../../../src/common/repositories/expensesRepository'
import { init as initFiles } from '../../../src/common/repositories/expenseFilesRepository'
import { init as initExpenseItems } from '../../../src/common/repositories/expenseItemsRepository'
import { createExpense, deleteExpensesByCommentPattern } from '../../../src/common/services/expensesService'
import { createFile, deleteFilesByPathPattern } from '../../../src/common/services/expenseFilesService'
import { listExpenses, getExpenseById } from '../../../src/common/services/expensesService'
import { createExpenseItem, deleteExpenseItemByDescriptionPattern } from '../../../src/common/services/expenseItemsService'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-expensesServiceTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenses(knexInstance)
  await initFiles(knexInstance)
  await initExpenseItems(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern(PREFIX + '%')
  await deleteExpenseItemByDescriptionPattern(PREFIX + '%')
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
        type_id: 1,
        date: moment().toISOString(),
        comment: PREFIX + 'foo'
      })
      const result = await getExpenseById(expense.id)

      expect(result.id).to.equal(expense.id)
      expect(result.files).to.be.ok
      expect(result.type).to.be.ok
      expect(result.type.id).to.equal(1)
    })

    it('should return the expense that matches the id including its files', async () => {
      const expense = await createExpense({
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
      expect(result.files.length).to.equal(1)
      expect(result.files[0].path).to.equal(PREFIX + '/foo/bla.doc')
    })

    it('should return the expenses that matches the id including its bill items', async () => {
      const expense = await createExpense({
        type_id: 1,
        date: moment().toISOString()
      })
      await createExpenseItem({
        expense_id: expense.id,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'desc'
      })
      await createExpenseItem({
        expense_id: expense.id,
        position: 1,
        preTaxAmount: 456,
        taxrate: 10,
        description: PREFIX + 'desc2'
      })
      const result = await getExpenseById(expense.id)

      expect(result.items.length).to.equal(2)
      expect(result.items[0].position).to.equal(0)
      expect(result.items[0].preTaxAmount).to.equal(123.45)
      expect(result.items[0].taxrate).to.equal(19)
      expect(result.items[0].description).to.equal(PREFIX + 'desc')
      expect(result.items[1].position).to.equal(1)
      expect(result.items[1].preTaxAmount).to.equal(456)
      expect(result.items[1].taxrate).to.equal(10)
      expect(result.items[1].description).to.equal(PREFIX + 'desc2')
      expect(result.type).to.be.ok
      expect(result.type.id).to.be.ok
    })
  })
})