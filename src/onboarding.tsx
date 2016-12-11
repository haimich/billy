import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppComponent from './onboarding/AppComponent'

async function init() {
  console.log('open onboarding window');
  
  ReactDOM.render(
    <div>
      <AppComponent />
    </div>,
    document.getElementById('app')
  )
}

init()