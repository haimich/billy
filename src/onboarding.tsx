import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './onboarding/AppComponent'
import { get, set } from './common/repositories/settingsRepository'

async function init() {

  ReactDOM.render(
    <div>
      <AppComponent />
    </div>,
    document.getElementById('app')
  )
}

init()