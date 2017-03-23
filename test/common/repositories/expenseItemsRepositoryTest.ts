import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import {
  init as initExpenseItems, getExpenseItemById, createExpenseItem, updateExpenseItem,
  getExpenseItemsByExpenseId, deleteExpenseItemByDescriptionPattern
} from '../../../src/common/repositories/expenseItemsRepository'
import { init as initExpenses, createExpense, deleteExpensesByCommentPattern } from '../../../src/common/repositories/expensesRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')

const PREFIX = 'INTEGRATIONTEST-billItemsRepositoryTest-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenseItems(knexInstance)
  await initExpenses(knexInstance)
})

afterEach(async () => {
  await deleteExpenseItemByDescriptionPattern(PREFIX + '%')
  await deleteExpensesByCommentPattern(PREFIX + '%')
})

describe('billItemsRepository', () => {
  let expense

  beforeEach(async () => {
    expense = await createExpense({
      type_id: 1,
      date: '2016-05-27'
    })
  })

  describe('createExpenseItem', () => {
    it('should return the created expenseItem', async () => {
      const expenseItem = await createExpenseItem({
        expense_id: 1,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'Tanzschule'
      })

      expect(expenseItem.position).to.equal(0)
      expect(expenseItem.preTaxAmount).to.equal(123.45)
      expect(expenseItem.taxrate).to.equal(19)
      expect(expenseItem.description).to.equal(PREFIX + 'Tanzschule')
    })
  })

  describe('updateExpenseItem', () => {
    it('should update the expenseItem', async () => {
      const expenseItem = await createExpenseItem({
        expense_id: expense.id,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'Tanzschule'
      })

      await updateExpenseItem({
        id: expenseItem.id,
        description: PREFIX + 'the-updated-type'
      })

      const updatedExpenseItem = await getExpenseItemById(expenseItem.id!)

      expect(updatedExpenseItem.description).to.equal(PREFIX + 'the-updated-type')
    })
  })

  describe('getExpenseItemsByExpenseId', () => {
    it('should return all bill items for a bill sorted by position', async () => {
      const e = await createExpense({
        type_id: 1,
        date: moment().toISOString()
      })
      
      const item1 = await createExpenseItem({
        expense_id: e.id,
        position: 0,
        preTaxAmount: 123.45,
        taxrate: 19,
        description: PREFIX + 'Hinfahrt'
      })
      const item2 = await createExpenseItem({
        expense_id: e.id,
        position: 1,
        preTaxAmount: 456,
        taxrate: 10,
        description: PREFIX + 'Heimfahrt'
      })

      const expenseTypes = await getExpenseItemsByExpenseId(e.id)

      expect(expenseTypes).to.have.length(2)
      expect(expenseTypes[0].description).to.equal(PREFIX + 'Hinfahrt')
      expect(expenseTypes[1].description).to.equal(PREFIX + 'Heimfahrt')
    })
  })

})