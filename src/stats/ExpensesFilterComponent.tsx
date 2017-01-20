import * as React from 'react';
import * as ReactDOM from 'react-dom'
import ExpenseTypeModel from '../common/models/ExpenseTypeModel'
import t from '../common/helpers/i18n'

export const SELECT_TYPE_ALL = t('Alle')

interface Props {
  years: string[]
  expenseTypes: ExpenseTypeModel[]
  selectedYear: string
  handleYearChange
  selectedExpenseType: string
  handleExpenseTypeChange
}

export default class ExpensesFilterComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

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

  generateExpenseTypeSelectbox() {
    let options: JSX.Element[] = [ <option key={100000}>{SELECT_TYPE_ALL}</option> ]

    for (let type of this.props.expenseTypes) {
      options.push(<option key={type.id}>{type.type}</option>)
    }

    return (
      <select
        className="form-control"
        id="expenseType"
        value={this.props.selectedExpenseType}
        onChange={this.props.handleExpenseTypeChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  render() {
    return (
      <form id="filter-container">
        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}

        <label htmlFor="expenseType">{t('Typ der Ausgabe')}</label>
        {this.generateExpenseTypeSelectbox()}

      </form>
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