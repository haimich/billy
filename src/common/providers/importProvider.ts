const basicCSV = require('basic-csv')

function removeHeaderRow(rows) {
  if (rows[0][0].indexOf('Date Created') !== -1) {
    rows.shift()
  }

  return rows
}

function createBill(record) {
  let bill = {
    id: '' + record[6],
    customer: record[5],
    amount: record[3],
    date_created: record[0],
    date_paid: record[1],
    comment: record[2]
  }

  bill.id = bill.id.replace(/\./g, '')
  bill.amount = bill.amount.replace('€', '')
  bill.amount = bill.amount.replace(/\./g, '')
  bill.amount = bill.amount.replace(',', '.')

  return bill
}

export function importCsv(fileName): Promise<any[]> {
  return new Promise((resolve, reject) => {
    basicCSV.readCSV(fileName, async (error, rows) => {
      if (error) {
        return reject('Error during import: ' + error)
      } else if (rows == null || rows.length === 0) {
        return reject('No valid entries found')
      }

      try {
        const bills = removeHeaderRow(rows)!.map(createBill)
        resolve(bills)
      } catch (err) {
        reject('Error during csv mapping: ' + err)
      }
    })
  })
}
