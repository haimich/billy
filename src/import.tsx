import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { initDb } from './common/providers/dbProvider'
import { get } from './common/providers/settingsProvider'
import { init as initBillsRepo } from './common/repositories/billsRepository'
import { init as initCustomersRepo } from './common/repositories/customersRepository'
import AppComponent from './import/AppComponent'

async function init() {
  console.log('init import window');
  
  try {
    const knexConfig = await get('knex')
    const knexInstance = await initDb(knexConfig)
    initBillsRepo(knexInstance)
    initCustomersRepo(knexInstance)
  } catch (err) {
    alert('Could not initialize database: ' + err.message)
    return
  }

  ReactDOM.render(
    <div>
      <AppComponent />
    </div>,
    document.getElementById('app')
  )
}

init()