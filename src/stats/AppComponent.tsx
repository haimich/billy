import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import BillsStatsComponent from './BillsStatsComponent'
import OnOffSwitchComponent from '../common/components/OnOffSwitchComponent'
import BillDbModel from '../common/models/BillDbModel'
import BillTypeModel from '../common/models/BillTypeModel'
import Customer from '../common/models/CustomerModel'
import t from '../common/helpers/i18n'
import { asc, desc } from '../common/helpers/sorters'
import { dateFormatterYearView } from '../common/ui/formatters'
import * as moment from 'moment'
import { getAverage, round } from '../common/helpers/math'

interface Props {
  customers: Customer[]
  bills: BillDbModel[]
  billTypes: BillTypeModel[]
}

interface State {
  mode: 'bills' | 'expenses'
}

export default class AppComponent extends React.Component<Props, {}> {

  state: State

  constructor(props) {
    super(props)

    this.state = {
      mode: 'bills'
    }

    ipcRenderer.on('shortcut-CommandOrControl+d', () => {
      this.toggleMode()
    })
  }

  toggleMode() {
    if (this.state.mode === 'bills') {
      this.setState({ mode: 'expenses' })
    } else if (this.state.mode === 'expenses') {
      this.setState({ mode: 'bills' })
    }
  }


  render() {
    let statsView

    if (this.state.mode === 'bills') {
      statsView =
        <BillsStatsComponent
          bills={this.props.bills}
          customers={this.props.customers}
          billTypes={this.props.billTypes}
        />
    } else if (this.state.mode === 'expenses') {
      statsView =
        <BillsStatsComponent
          bills={this.props.bills}
          customers={this.props.customers}
          billTypes={this.props.billTypes}
        />
    }

    return (
      <div>
        <OnOffSwitchComponent
          activeLabel={t('Ausgaben')}
          inactiveLabel={t('Einnahmen')}
          selectedValue={this.state.mode}
          keys={{inactive: 'bills', active: 'expenses'}}
          handleValueChange={newValue => this.setState({ mode: newValue})}
        />

        {statsView}
      </div>
    )
  }

}
