import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { SELECT_TYPE_ALL } from '../../ui/stats'
import t from '../../helpers/i18n'

interface Props {
  years: string[]
  selectedYear: string
  handleYearChange
}

export default class YearsFilterComponent extends React.Component<Props, {}> {

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

  render() {
    return (
      <div>
      
        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}
        
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