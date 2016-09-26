import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './onboarding/AppComponent'

async function init() {
  ReactDOM.render(
    <div>
      <AppComponent />
    </div>,
    document.getElementById('app')
  )
}

init()