import { initDb, setupDb } from '../../../src/common/providers/dbProvider'
import {
  init as initExpenses, expenseExists, deleteExpensesByTypePattern, createExpense,
  updateExpense, listExpenses, getExpenseById, deleteExpenseById
} from '../../../src/common/repositories/expensesRepository'
import { expect } from 'chai'
import * as moment from 'moment'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-'

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenses(knexInstance)
})

afterEach(async () => {
  await deleteExpensesByTypePattern(PREFIX + '%')
})

describe('expensesRepository', () => {

  describe('expenseExists', () => {
    it('should return true if the expense exists', async () => {
      const testDate = moment().toISOString()

      const expense = await createExpense({
        type: PREFIX + 'Kopierpapier',
        preTaxAmount: 123.45,
        taxrate: 7,
        date: testDate
      })

      expect(await expenseExists(expense.id)).to.be.true
    })
  })

  describe('createExpense', () => {
    it('should return the created expense', async () => {
      const testDate = moment().toISOString()

      const expense = await createExpense({
        type: PREFIX + 'Briefmarken',
        preTaxAmount: 123.45,
        taxrate: 0,
        date: testDate
      })

      expect(expense.id).to.be.ok
      expect(expense.type).to.equal(PREFIX + 'Briefmarken')
      expect(expense.preTaxAmount).to.equal(123.45)
      expect(expense.taxrate).to.equal(0)
      expect(expense.date).to.equal(testDate)
    })
  })

  describe('updateExpense', () => {
    it('should update the expense', async () => {
      const testDate = moment().toISOString()

      let createdExpense = await createExpense({
        type: PREFIX + 'Klopapier',
        preTaxAmount: 15,
        taxrate: 12,
        date: testDate
      })

      const updatedExpense = await updateExpense({
        id: createdExpense.id,
        type: PREFIX + 'Seife',
        preTaxAmount: 54,
        taxrate: 4,
        date: testDate
      })

      expect(updatedExpense.type).to.equal(PREFIX + 'Seife')
      expect(updatedExpense.preTaxAmount).to.equal(54)
      expect(updatedExpense.taxrate).to.equal(4)
      expect(updatedExpense.date).to.equal(testDate)
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
      
      const expense = await createExpense({
        type: PREFIX + 'Schnur',
        preTaxAmount: 15,
        taxrate: 12,
        date: testDate
      })
      const result = await getExpenseById(expense.id)

      expect(result.id).to.equal(expense.id)
      expect(result.type).to.equal(PREFIX + 'Schnur')
      expect(result.preTaxAmount).to.equal(15)
      expect(result.taxrate).to.equal(12)
      expect(result.date).to.equal(testDate)
    })
  })

  describe('deleteExpenseById', () => {
    it('should delete the expense', async () => {
      const testDate = moment().toISOString()
      
      const expense = await createExpense({
        type: PREFIX + 'Faden',
        preTaxAmount: 15,
        taxrate: 12,
        date: testDate
      })

      expect(await expenseExists(expense.id)).to.be.true
      
      const result = await deleteExpenseById(expense.id)

      expect(await expenseExists(expense.id)).to.be.false
    })
  })

})