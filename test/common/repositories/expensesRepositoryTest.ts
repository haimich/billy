import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import {
  init as initExpenses, expenseExists, deleteExpensesByCommentPattern, createExpense,
  updateExpense, listExpenses, getExpenseById, deleteExpenseById
} from '../../../src/common/repositories/expensesRepository'
import { init as initExpenseTypes, createExpenseType, deleteExpenseTypeByNamePattern } from '../../../src/common/repositories/expenseTypesRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenses(knexInstance)
  await initExpenseTypes(knexInstance)
})

afterEach(async () => {
  await deleteExpensesByCommentPattern(PREFIX + '%')
  await deleteExpenseTypeByNamePattern(PREFIX + '%')
})

describe('expensesRepository', () => {

  describe('expenseExists', () => {
    it('should return true if the expense exists', async () => {
      const testDate = moment().toISOString()
      const type = await createExpenseType({ type: PREFIX + 'Briefmarken' })

      const expense = await createExpense({
        type_id: type.id,
        preTaxAmount: 123.45,
        taxrate: 7,
        date: testDate,
        comment: PREFIX + 'foo'
      })

      expect(await expenseExists(expense.id)).to.be.true
    })
  })

  describe('createExpense', () => {
    it('should return the created expense', async () => {
      const testDate = moment().toISOString()
      const type = await createExpenseType({ type: PREFIX + 'Briefmarken' })

      const expense = await createExpense({
        type_id: type.id,
        preTaxAmount: 123.45,
        taxrate: 0,
        date: testDate,
        comment: PREFIX + 'bla foo'
      })

      expect(expense.id).to.be.ok
      expect(expense.type.id).to.equal(type.id)
      expect(expense.type.type).to.equal(type.type)
      expect(expense.type_name).to.equal(PREFIX + 'Briefmarken')
      expect(expense.preTaxAmount).to.equal(123.45)
      expect(expense.taxrate).to.equal(0)
      expect(expense.date).to.equal(testDate)
      expect(expense.comment).to.equal(PREFIX + 'bla foo')
    })
  })

  describe('updateExpense', () => {
    it('should update the expense', async () => {
      const testDate = moment().toISOString()
      const type1 = await createExpenseType({ type: PREFIX + 'Klopaier' })
      const type2 = await createExpenseType({ type: PREFIX + 'Seife' })

      let createdExpense = await createExpense({
        type_id: type1.id,
        preTaxAmount: 15,
        taxrate: 12,
        date: testDate,
        comment: PREFIX + 'deine mudda'
      })

      const updatedExpense = await updateExpense({
        id: createdExpense.id,
        type_id: type2.id,
        preTaxAmount: 54,
        taxrate: 4,
        date: testDate,
        comment: PREFIX + 'no'
      })

      expect(updatedExpense.type_name).to.equal(PREFIX + 'Seife')
      expect(updatedExpense.preTaxAmount).to.equal(54)
      expect(updatedExpense.taxrate).to.equal(4)
      expect(updatedExpense.date).to.equal(testDate)
      expect(updatedExpense.comment).to.equal(PREFIX + 'no')
    })
  })

  describe('listExpenses', () => {
    it('should return all expenses sorted by date', async () => {
      const expenses = await listExpenses()

      expect(expenses.length).to.be.above(1)
      expect(moment(expenses[0].date).isBefore(moment(expenses[1].date))).to.be.true
      expect(expenses[0].type).to.be.ok
      expect(expenses[0].preTaxAmount).to.be.ok
      expect(expenses[0].taxrate).to.be.ok
    })
  })

  describe('getExpenseById', () => {
    it('should return the expense that matches the id', async () => {
      const testDate = moment().toISOString()
      const type = await createExpenseType({ type: PREFIX + 'the-type' })
      
      const expense = await createExpense({
        type_id: type.id,
        preTaxAmount: 15,
        taxrate: 12,
        date: testDate,
        comment: PREFIX + 'foo bar'
      })
      const result = await getExpenseById(expense.id)

      expect(result.id).to.equal(expense.id)
      expect(result.type_name).to.equal(PREFIX + 'the-type')
      expect(result.type.id).to.equal(type.id)
      expect(result.type.type).to.equal(type.type)
      expect(result.preTaxAmount).to.equal(15)
      expect(result.taxrate).to.equal(12)
      expect(result.date).to.equal(testDate)
      expect(result.comment).to.equal(PREFIX + 'foo bar')
    })
  })

  describe('deleteExpenseById', () => {
    it('should delete the expense', async () => {
      const testDate = moment().toISOString()
      const type = await createExpenseType({ type: PREFIX + 'the-type' })
      
      const expense = await createExpense({
        type_id: type.id,
        preTaxAmount: 15,
        taxrate: 12,
        date: testDate,
        comment: PREFIX + 'comment'
      })

      expect(await expenseExists(expense.id)).to.be.true
      
      const result = await deleteExpenseById(expense.id)

      expect(await expenseExists(expense.id)).to.be.false
    })
  })

})