import { initDb } from '../../../src/common/providers/dbProvider'
import { rmrf, exists } from '../../../src/common/providers/fileProvider'
import { init as initFiles } from '../../../src/common/repositories/expenseFilesRepository'
import { init as initExpenses } from '../../../src/common/repositories/expensesRepository'
import { createExpense, deleteExpensesByCommentPattern } from '../../../src/common/services/expensesService'
import { deleteAllFilesForExpense, deleteFilesByPathPattern, getFilesForExpenseId, performExpenseFileActions } from '../../../src/common/services/expenseFilesService'
import { expect } from 'chai'

const knexConfig = require('../../../../knexfile')
const PREFIX = 'INTEGRATIONTEST-'
const baseDir = process.cwd()
const filesDir = `${baseDir}/files/expenses`

before(async () => {
  const knexInstance = await initDb(knexConfig)
  await initExpenses(knexInstance)
  await initFiles(knexInstance)
})

afterEach(async () => {
  await deleteFilesByPathPattern(PREFIX + '%')
  await deleteExpensesByCommentPattern(PREFIX + '%')
  await rmrf(`${filesDir}/*`)
})

describe('expenseFilesService', () => {

  let expense

  beforeEach(async () => {
    expense = await createExpense({
      preTaxAmount: 123,
      taxrate: 19,
      date: '2016-05-27',
      type_id: 1,
      comment: PREFIX + 'foo'
    })
  })

  describe('saveFiles', () => {

    it('should add new files', async () => {
      expect(await getFilesForExpenseId(expense.id)).to.be.empty

      await performExpenseFileActions(expense, {
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` },
          { expense_id: expense.id, path: `${baseDir}/test/resources/b.txt` },
          { expense_id: expense.id, path: `${baseDir}/test/resources/c.txt` }
        ]
      })

      const existingFiles = await getFilesForExpenseId(expense.id)

      expect(existingFiles.length).to.equal(3)
      expect(existingFiles[0].path).to.equal(`${filesDir}/${expense.id}/a.txt`)
      expect(existingFiles[1].path).to.equal(`${filesDir}/${expense.id}/b.txt`)
      expect(existingFiles[2].path).to.equal(`${filesDir}/${expense.id}/c.txt`)
    })

    it('should allow to add same file after it was previously removed', async () => {
      await performExpenseFileActions(expense, {
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      await performExpenseFileActions(expense, {
        delete: [
          (await getFilesForExpenseId(expense.id))[0]
        ]
      })

      await performExpenseFileActions(expense, {
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      const existingFiles = await getFilesForExpenseId(expense.id)

      expect(existingFiles.length).to.equal(1)
      expect(existingFiles[0].path).to.equal(`${filesDir}/${expense.id}/a.txt`)
    })

    it('should allow to overwrite a file with a newer version of itself', async () => {
      await performExpenseFileActions(expense, {
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      await performExpenseFileActions(expense, {
        delete: [
          (await getFilesForExpenseId(expense.id))[0]
        ],
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      const existingFiles = await getFilesForExpenseId(expense.id)

      expect(existingFiles.length).to.equal(1)
      expect(existingFiles[0].path).to.equal(`${filesDir}/${expense.id}/a.txt`)
    })

    it('should only change new files', async () => {
      await performExpenseFileActions(expense, {
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` }
        ]
      })

      let existingFiles = await getFilesForExpenseId(expense.id)
      expect(existingFiles.length).to.equal(1)

      await performExpenseFileActions(expense, {
        keep: [
          { expense_id: expense.id, path: `${filesDir}/${expense.id}/a.txt` }
        ],
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/b.txt` },
          { expense_id: expense.id, path: `${baseDir}/test/resources/c.txt` }
        ]
      })

      existingFiles = await getFilesForExpenseId(expense.id)

      expect(existingFiles.length).to.equal(3)
      expect(existingFiles[0].path).to.equal(`${filesDir}/${expense.id}/a.txt`)
      expect(existingFiles[1].path).to.equal(`${filesDir}/${expense.id}/b.txt`)
      expect(existingFiles[2].path).to.equal(`${filesDir}/${expense.id}/c.txt`)
    })

    it('should delete obsolete files', async () => {
      await performExpenseFileActions(expense, {
        add: [
        { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` }
      ]})

      let existingFiles = await getFilesForExpenseId(expense.id)

      await performExpenseFileActions(expense, {
        delete: existingFiles,
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/b.txt` },
          { expense_id: expense.id, path: `${baseDir}/test/resources/c.txt` }
        ]
      })

      existingFiles = await getFilesForExpenseId(expense.id)

      expect(existingFiles.length).to.equal(2)
      expect(existingFiles[0].path).to.equal(`${filesDir}/${expense.id}/b.txt`)
      expect(existingFiles[1].path).to.equal(`${filesDir}/${expense.id}/c.txt`)
    })

  })

  describe('deleteAllFilesForBillId', () => {

    it('should delete all files for a bill', async () => {
      await performExpenseFileActions(expense, {
        add: [
          { expense_id: expense.id, path: `${baseDir}/test/resources/a.txt` },
          { expense_id: expense.id, path: `${baseDir}/test/resources/b.txt` }
        ]
      })

      await deleteAllFilesForExpense(expense.id)

      let existingFiles = await getFilesForExpenseId(expense.id)
      expect(existingFiles.length).to.equal(0)

      let folderExists = await exists(`${filesDir}/${expense.id}`)
      expect(folderExists).to.be.false
    })

  })

})