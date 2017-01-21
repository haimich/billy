import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { SELECT_TYPE_ALL } from '../ui/stats'
import t from '../helpers/i18n'

interface Props {
  years: string[]
  types: any[]
  selectedYear: string
  handleYearChange
  selectedType: string
  handleTypeChange
  dateFieldName: string
}

export default class StatsFilterComponent extends React.Component<Props, {}> {

  generateYearSelectbox() {
    let options: JSX.Element[] = []

    for (let year of this.props.years) {
      options.push(<option key={year}>{year}</option>)
    }

    return (
      <select
        className="form-control"
        id="year"
        value={this.props.selectedYear}
        onChange={this.props.handleYearChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  generateTypeSelectbox() {
    let options: JSX.Element[] = [ <option key={100000}>{SELECT_TYPE_ALL}</option> ]

    for (let type of this.props.types) {
      options.push(<option key={type.id}>{type.type}</option>)
    }

    return (
      <select
        className="form-control"
        id="billType"
        value={this.props.selectedType}
        onChange={this.props.handleTypeChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  render() {
    return (
      <div>
      
        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}

        <label htmlFor="billType">{t('Auftragsart')}</label>
        {this.generateTypeSelectbox()}

      </div>
    )
  }

  componentWillReceiveProps(nextProps: Props) {
    const selectedYearNotAvailable = (nextProps.years.indexOf(nextProps.selectedYear) === -1)

    if (selectedYearNotAvailable) {
      let closestYear = nextProps.years.length >= 1
        ? nextProps.years[0]
        : ''
      this.props.handleYearChange({
        target: {
          value: closestYear
        }
      })
    }
  }

}