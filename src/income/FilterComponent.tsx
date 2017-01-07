import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'

interface Props {
  selectedYear: string
  availableYears: string[]
  handleYearChange: (event) => void
}

export default class FilterComponent extends React.Component<Props, {}> {

  props: Props

  generateYearSelectbox() {
    let options: JSX.Element[] = []

    for (let year of this.props.availableYears) {
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
      <div id="filter-container">
        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}
      </div>
    )
  }
}